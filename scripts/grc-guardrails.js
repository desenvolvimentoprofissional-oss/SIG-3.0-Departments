import fs from 'fs';
import path from 'path';

let hasErrors = false;

function getAllFiles(dir, exts, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllFiles(filePath, exts, fileList);
    } else {
      if (exts.some(ext => filePath.endsWith(ext))) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

console.log('🛡️  Iniciando verificação do Linter de Conformidade GRC (SIG 3.0 / AGENTS.md)...\n');
const allTsFiles = [
  ...getAllFiles('front-end-client/src', ['.ts', '.tsx']),
  ...getAllFiles('control-plane-server/src', ['.ts'])
];

let filesOver300 = 0;
for (const file of allTsFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n').length;
  if (lines > 300) {
    console.error(`❌ [VIOLAÇÃO GRC - SRP] Arquivo excede o limite de 300 linhas (${lines} linhas): ${file}`);
    hasErrors = true;
    filesOver300++;
  }
}
if (filesOver300 === 0) {
  console.log('✅ [REGRA 1] Limite de linhas (<= 300) respeitado em todos os módulos.');
}
const apiFiles = getAllFiles('front-end-client/src/api', ['.ts']);
let dbImportsInApi = 0;
const dbImportRegex = /import\s+.*\{\s*db\s*\}.*from/i;
for (const file of apiFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  if (dbImportRegex.test(content)) {
    console.error(`❌ [VIOLAÇÃO GRC - SILOS] Import estático de instâncias Firestore (import { db }) proibido na camada API (Factory Pattern mandatório): ${file}`);
    hasErrors = true;
    dbImportsInApi++;
  }
}
if (dbImportsInApi === 0) {
  console.log('✅ [REGRA 2] Acoplamento Inverso e Factory Pattern respeitados em /src/api/.');
}
const frontendFiles = getAllFiles('front-end-client/src', ['.ts', '.tsx']);
let docCookieCount = 0;
for (const file of frontendFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('document.cookie')) {
    console.error(`❌ [VIOLAÇÃO GRC - OWASP] Manipulação direta de document.cookie proibida no cliente web: ${file}`);
    hasErrors = true;
    docCookieCount++;
  }
}
if (docCookieCount === 0) {
  console.log('✅ [REGRA 3] Proibição absoluta de manipulação de cookies no front-end respeitada.');
}
const tsxFiles = getAllFiles('front-end-client/src', ['.tsx']);
let mutationsInTsx = 0;
const mutationRegex = /\b(setDoc|updateDoc|addDoc|deleteDoc)\b/;
for (const file of tsxFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  if (mutationRegex.test(content)) {
    console.error(`❌ [VIOLAÇÃO GRC - MULTI-TENANT] Mutação imperativa do Firestore detectada em componente visual .tsx: ${file}`);
    hasErrors = true;
    mutationsInTsx++;
  }
}
if (mutationsInTsx === 0) {
  console.log('✅ [REGRA 4] Ausência de mutações diretas do Firestore em componentes visuais .tsx verificada.');
}

console.log('');
if (hasErrors) {
  console.error('💥 Linter de Conformidade GRC falhou! Corrija as violações acima antes de compilar ou aprovar o build.');
  process.exit(1);
} else {
  console.log('🌟 Todas as travas e guardrails da conformidade GRC GEMS / AGENTS.md foram validadas com sucesso!');
  process.exit(0);
}
