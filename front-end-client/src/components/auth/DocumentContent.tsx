import React from 'react';
import { DocumentType } from './DocumentModal';

interface DocumentContentProps {
  currentDoc: DocumentType;
  bodyTextSize: string;
  textColor: string;
  subHeadingColor: string;
  headingColor: string;
  numberBg: string;
  numberText: string;
  boxBg: string;
  linkColor: string;
  markerColor: string;
}

export const DocumentContent: React.FC<DocumentContentProps> = ({
  currentDoc,
  bodyTextSize,
  textColor,
  subHeadingColor,
  headingColor,
  numberBg,
  numberText,
  boxBg,
  linkColor,
  markerColor
}) => {
  if (currentDoc === 'privacidade') {
    return (
      <>
        <div className="flex gap-4">
          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>1</div>
          <div>
            <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Controlador e Encarregado de Proteção de Dados (DPO)</h4>
            <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
              Controlador de Dados: Conselho Regional de Administração de São Paulo (CRA-SP), inscrito no CNPJ sob o nº 43.060.078/0001-04, com sede na Rua Estados Unidos, 865/889 - Jardim América, São Paulo - SP, CEP-01427-001. Encarregado de Proteção de Dados (DPO): Para qualquer questão relacionada à proteção de seus dados, você pode contatar nosso DPO, Allmo Consultoria Ltda., através do e-mail: <a href="mailto:lgpd@crasp.org.br" className={`${linkColor} hover:underline font-bold`}>lgpd@crasp.org.br</a>.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>2</div>
          <div className="w-full">
            <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Quais Dados Pessoais Tratamos e Por Quê</h4>
            <p className={`font-normal leading-relaxed ${bodyTextSize} mb-4 ${textColor}`}>Tratamos os seguintes dados para operar o sistema:</p>
            
            <div className={`rounded-lg p-5 mb-4 border ${boxBg}`}>
              <h5 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-2 ${subHeadingColor}`}>Dados de Cadastro</h5>
              <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
                Informações fornecidas pelo administrador — nome completo, e-mail, cargo, gênero e senha criptografada — necessárias para execução de contrato (art. 7º, V, LGPD) e cumprimento de obrigação legal (art. 7º, II, LGPD).
              </p>
            </div>

            <div className={`rounded-lg p-5 border ${boxBg}`}>
              <h5 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-2 ${subHeadingColor}`}>Dados de Uso</h5>
              <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
                Registros de acesso, logs de atividades, necessários para exercício regular de direitos e cumprimento de obrigação legal (art. 7º, VI e II, LGPD).
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>3</div>
          <div>
            <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Tratamento de Dados Sensíveis</h4>
            <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
              O CRA-SP não realiza tratamento de dados pessoais sensíveis no contexto do SIG. Caso futuramente seja necessário, o tratamento observará rigorosamente as hipóteses legais do artigo 11 da Lei Geral de Proteção de Dados Pessoais e será previamente informado aos titulares.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>4</div>
          <div>
            <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Seus Direitos como Titular de Dados</h4>
            <p className={`font-normal leading-relaxed ${bodyTextSize} mb-4 ${textColor}`}>A LGPD garante a você diversos direitos sobre seus dados. A qualquer momento, você pode solicitar:</p>
            
            <ul className={`space-y-4 mb-4 list-disc list-outside ml-4 ${markerColor}`}>
              <li>
                <strong className={`font-bold block mb-1 ${bodyTextSize} ${headingColor}`}>Confirmação e Acesso</strong>
                <span className={`font-normal ${bodyTextSize} ${textColor}`}>Saber se tratamos seus dados e acessar quais informações temos sobre você.</span>
              </li>
              <li>
                <strong className={`font-bold block mb-1 ${bodyTextSize} ${headingColor}`}>Correção</strong>
                <span className={`font-normal ${bodyTextSize} ${textColor}`}>Corrigir dados incompletos, inexatos ou desatualizados.</span>
              </li>
              <li>
                <strong className={`font-bold block mb-1 ${bodyTextSize} ${headingColor}`}>Anonimização, Bloqueio ou Eliminação</strong>
                <span className={`font-normal ${bodyTextSize} ${textColor}`}>Eliminar dados desnecessários ou tratados em desconformidade com a lei.</span>
              </li>
              <li>
                <strong className={`font-bold block mb-1 ${bodyTextSize} ${headingColor}`}>Portabilidade</strong>
                <span className={`font-normal ${bodyTextSize} ${textColor}`}>Transferir seus dados para outro fornecedor de serviços.</span>
              </li>
              <li>
                <strong className={`font-bold block mb-1 ${bodyTextSize} ${headingColor}`}>Revogação do Consentimento</strong>
                <span className={`font-normal ${bodyTextSize} ${textColor}`}>Retirar o seu consentimento, quando o tratamento de dados for baseado nele.</span>
              </li>
            </ul>

            <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
              Como exercer seus direitos: Envie sua solicitação diretamente ao nosso Encarregado de dados pelo e-mail <a href="mailto:lgpd@crasp.org.br" className={`${linkColor} hover:underline font-bold`}>lgpd@crasp.org.br</a> ou por meio do formulário eletrônico disponível no site oficial <a href="https://crasp.gov.br" target="_blank" rel="noopener noreferrer" className={`${linkColor} hover:underline font-bold`}>crasp.gov.br</a>. Também é possível encaminhar pedido por correspondência física ao endereço do CRA-SP. Responderemos no prazo de até 15 dias.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>5</div>
          <div>
            <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Compartilhamento de Dados</h4>
            <p className={`font-normal leading-relaxed ${bodyTextSize} mb-4 ${textColor}`}>O CRA-SP não vende nem compartilha seus dados pessoais com terceiros para fins de marketing. O compartilhamento poderá ocorrer apenas com:</p>
            
            <ul className={`space-y-4 list-disc list-outside ml-4 ${markerColor}`}>
              <li>
                <strong className={`font-bold block mb-1 ${bodyTextSize} ${headingColor}`}>Provedores de Tecnologia</strong>
                <span className={`font-normal ${bodyTextSize} ${textColor}`}>Empresas que nos fornecem a infraestrutura para operar o SIG (como o Google Workspace), que atuam como 'Operadores' e estão contratualmente obrigados a proteger seus dados.</span>
              </li>
              <li>
                <strong className={`font-bold block mb-1 ${bodyTextSize} ${headingColor}`}>Autoridades Legais</strong>
                <span className={`font-normal ${bodyTextSize} ${textColor}`}>Mediante ordem judicial ou requisição de autoridades competentes.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>6</div>
          <div>
            <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Cookies e Tecnologias de Rastreamento</h4>
            <p className={`font-normal leading-relaxed ${bodyTextSize} mb-4 ${textColor}`}>Utilizamos o armazenamento local do navegador (localStorage) para o funcionamento adequado do SIG.</p>
            
            <strong className={`font-bold block mb-1 ${bodyTextSize} ${headingColor}`}>Armazenamento Essencial</strong>
            <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
              Usamos para manter sua sessão de login ativa entre acessos e garantir a segurança. É indispensável para o uso do sistema. Você pode gerenciar ou limpar o armazenamento local através das configurações do seu navegador, mas isso exigirá que você faça login novamente a cada acesso.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>7</div>
          <div>
            <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Transferência Internacional de Dados</h4>
            <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
              Ao utilizarmos a infraestrutura do Google Workspace, seus dados podem ser processados em servidores localizados fora do Brasil. Essa transferência é realizada em conformidade com a LGPD, para países que oferecem um grau adequado de proteção de dados ou através de mecanismos contratuais que garantem seus direitos.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>8</div>
          <div>
            <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Armazenamento e Retenção dos Dados</h4>
            <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
              Seus dados serão mantidos enquanto você possuir uma conta ativa no SIG. Após o encerramento da conta, os dados serão mantidos bloqueados pelo período necessário para o cumprimento de obrigações legais ou regulatórias, sendo eliminados de forma segura ao final deste prazo.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex gap-4">
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>1</div>
        <div>
          <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Controle de Acesso</h4>
          <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
            O acesso ao SIG é restrito a usuários autorizados e controlado por um sistema de autenticação. As senhas são armazenadas com criptografia forte (SHA-256 com salt) e nunca em texto plano. O acesso às funcionalidades é baseado em perfis e permissões, seguindo o princípio do menor privilégio.
          </p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>2</div>
        <div>
          <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Autenticação de Dois Fatores (2FA)</h4>
          <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
            Recomendamos fortemente que todos os usuários ativem a autenticação de dois fatores em suas contas de e-mail associadas ao sistema para adicionar uma camada crítica de proteção.
          </p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>3</div>
        <div>
          <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Segurança dos Dados</h4>
          <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
            Utilizamos criptografia TLS (padrão do Google Apps Script) para proteger os dados em trânsito entre seu navegador e nossos servidores. Os dados em repouso são protegidos pela infraestrutura segura do Google Workspace.
          </p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>4</div>
        <div>
          <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Monitoramento e Logs</h4>
          <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
            Registramos eventos relevantes, como tentativas de login, alterações de senha e atividades críticas, para fins de auditoria, detecção de anomalias e monitoramento de atividades suspeitas.
          </p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>5</div>
        <div>
          <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Responsabilidade do Usuário</h4>
          <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
            A segurança é uma responsabilidade compartilhada. Mantenha sua senha confidencial, utilize senhas fortes e não as compartilhe. Encerre sua sessão (logout) sempre que terminar de usar o sistema, especialmente em computadores públicos ou compartilhados.
          </p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>6</div>
        <div>
          <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Notificação de Incidentes de Segurança</h4>
          <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
            Na improvável ocorrência de um incidente de segurança que possa acarretar risco ou dano relevante aos seus dados, o CRA-SP, por meio de seu Encarregado de Proteção de Dados (DPO), se compromete a comunicar os titulares afetados e a Autoridade Nacional de Proteção de Dados (ANPD) em prazo razoável, em conformidade com a legislação.
          </p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${bodyTextSize} mt-1 ${numberBg} ${numberText}`}>7</div>
        <div>
          <h4 className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-3 mt-1.5 ${subHeadingColor}`}>Gestão de Incidentes de Segurança</h4>
          <p className={`font-normal leading-relaxed ${bodyTextSize} ${textColor}`}>
            Em caso de incidente de segurança que possa acarretar risco ou dano relevante, o CRA-SP seguirá procedimento interno estruturado, com registro do evento, análise de impacto, comunicação à ANPD e aos titulares afetados no menor prazo possível, e implementação imediata de medidas corretivas e preventivas.
          </p>
        </div>
      </div>
    </>
  );
};
