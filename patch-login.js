const fs = require('fs');
const file = 'front-end-client/src/components/auth/LoginForm.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { getAuthUrlAPI, getCurrentUserAPI } from '../../api/auth.api';",
  "import { getAuthUrlAPI, getCurrentUserAPI } from '../../api/auth.api';\nimport { auth } from '../../api/firebase.client';\nimport { signInWithCustomToken } from 'firebase/auth';"
);

content = content.replace(
  "const cleanSession = sanitizeAndVerifyAuthPayload(authData.user);",
  "const cleanSession = sanitizeAndVerifyAuthPayload(authData.user);\n          if (authData.customToken) {\n            await signInWithCustomToken(auth, authData.customToken);\n            cleanSession.customToken = authData.customToken;\n          }"
);

fs.writeFileSync(file, content);
