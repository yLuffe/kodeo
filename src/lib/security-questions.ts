import { gamification } from './learning';

/** Questões originais e fictícias criadas para a trilha de introdução à cibersegurança. */
export interface SecurityQuestion {
  id: string;
  topic: string;
  difficulty: 'Básico' | 'Intermediário' | 'Avançado';
  title: string;
  context: string;
  options: readonly [string, string, string, string];
  correct: number;
  explanation: string;
  hint: string;
  xp: number;
}

export const securityQuestions: readonly SecurityQuestion[] = [
  {
    "id": "secq-01",
    "topic": "Fundamentos",
    "difficulty": "Básico",
    "title": "Qual princípio da segurança foi comprometido?",
    "context": "Em uma empresa fictícia, um invasor altera silenciosamente o valor de uma fatura armazenada. O arquivo continua disponível e não há sinais de divulgação dos dados.",
    "options": [
      "Disponibilidade",
      "Integridade",
      "Confidencialidade",
      "Não repúdio"
    ],
    "correct": 1,
    "explanation": "Integridade é a propriedade relacionada à exatidão e à proteção contra alterações não autorizadas. Não há evidência de perda de disponibilidade ou de sigilo.",
    "hint": "Considere o que aconteceu com o conteúdo do arquivo.",
    "xp": 10
  },
  {
    "id": "secq-02",
    "topic": "Fundamentos",
    "difficulty": "Básico",
    "title": "O que é a vulnerabilidade neste cenário?",
    "context": "Uma aplicação exposta à internet utiliza uma biblioteca desatualizada com uma falha conhecida. Nenhuma exploração foi identificada até o momento.",
    "options": [
      "A falha da biblioteca instalada",
      "O atacante que poderia explorar a falha",
      "O prejuízo financeiro decorrente de um ataque",
      "A combinação de probabilidade e impacto"
    ],
    "correct": 0,
    "explanation": "A vulnerabilidade é a fraqueza explorável na biblioteca. Ameaça é a possível fonte de dano; risco envolve a probabilidade e o impacto. A existência da falha não significa que tenha sido explorada.",
    "hint": "Diferencie a fraqueza técnica, o agente de ameaça e o risco.",
    "xp": 10
  },
  {
    "id": "secq-03",
    "topic": "Fundamentos",
    "difficulty": "Básico",
    "title": "Como confirmar uma mensagem potencialmente fraudulenta?",
    "context": "Um e-mail solicita com urgência que você confirme sua senha em uma página cujo endereço é parecido com o portal corporativo.",
    "options": [
      "Responder à mensagem pedindo confirmação",
      "Abrir o link porque ele utiliza HTTPS",
      "Validar a solicitação por um canal oficial independente",
      "Enviar a senha para o suporte indicado no e-mail"
    ],
    "correct": 2,
    "explanation": "A solicitação deve ser confirmada por um canal obtido de forma independente, como um portal conhecido ou ramal oficial. HTTPS não comprova a legitimidade do site, apenas protege a conexão.",
    "hint": "Evite utilizar os contatos oferecidos pelo próprio e-mail suspeito.",
    "xp": 10
  },
  {
    "id": "secq-04",
    "topic": "Fundamentos",
    "difficulty": "Básico",
    "title": "Qual alternativa combina dois fatores de autenticação distintos?",
    "context": "Uma organização deseja tornar mais segura a entrada de administradores em seus sistemas.",
    "options": [
      "Senha e pergunta secreta",
      "Duas senhas de acesso diferentes",
      "Senha e PIN memorizado",
      "Senha e confirmação em aplicativo autenticador no celular"
    ],
    "correct": 3,
    "explanation": "A senha representa conhecimento, enquanto o aplicativo autenticador vinculado ao dispositivo representa posse. Duas senhas, ou senha e PIN, pertencem à mesma categoria de fator.",
    "hint": "Procure uma combinação entre algo conhecido e algo possuído.",
    "xp": 10
  },
  {
    "id": "secq-05",
    "topic": "Fundamentos",
    "difficulty": "Intermediário",
    "title": "Qual estratégia favorece a recuperação após ransomware?",
    "context": "Um invasor criptografa arquivos de um servidor e tenta apagar as cópias de segurança disponíveis.",
    "options": [
      "Guardar apenas cópias no próprio volume afetado",
      "Manter backups isolados ou imutáveis e testar restaurações",
      "Desligar a auditoria para acelerar a recuperação",
      "Usar sincronização de arquivos como único backup"
    ],
    "correct": 1,
    "explanation": "Backups isolados ou imutáveis dificultam a destruição das cópias e testes de restauração confirmam sua utilidade. Uma sincronização simples também pode propagar os arquivos criptografados.",
    "hint": "Considere como proteger as cópias até mesmo contra quem controla o servidor.",
    "xp": 10
  },
  {
    "id": "secq-06",
    "topic": "Avaliação de segurança",
    "difficulty": "Intermediário",
    "title": "Qual atitude respeita os limites de um teste autorizado?",
    "context": "Durante uma avaliação, o analista encontra um subdomínio pertencente a um fornecedor que não consta do escopo contratado. Ele suspeita de uma vulnerabilidade crítica.",
    "options": [
      "Explorar porque o domínio parece relacionado ao cliente",
      "Solicitar autorização formal antes de testar o ativo",
      "Explorar primeiro e relatar somente ao final",
      "Copiar dados do fornecedor para comprovar o impacto"
    ],
    "correct": 1,
    "explanation": "O escopo e as regras de engajamento definem os ativos que podem ser testados. Uma suspeita de falha não autoriza testes intrusivos em infraestrutura de terceiros.",
    "hint": "Uma descoberta fora de escopo não amplia automaticamente a autorização.",
    "xp": 10
  },
  {
    "id": "secq-07",
    "topic": "Avaliação de segurança",
    "difficulty": "Intermediário",
    "title": "Qual mudança corrige a causa de uma injeção SQL?",
    "context": "Uma aplicação monta consultas ao banco concatenando diretamente o texto recebido de um campo de pesquisa. Um teste autorizado demonstra que a entrada consegue alterar a lógica da consulta.",
    "options": [
      "Ocultar mensagens detalhadas de erro do banco",
      "Bloquear apenas os caracteres de aspas simples",
      "Substituir concatenação por consultas parametrizadas",
      "Aumentar o tamanho máximo permitido no campo"
    ],
    "correct": 2,
    "explanation": "Consultas parametrizadas separam valores de entrada da estrutura da instrução SQL, eliminando a interpretação da entrada como parte do comando. Ocultar erros e filtros pontuais não corrigem a causa.",
    "hint": "A solução deve separar dados fornecidos pelo usuário da instrução SQL.",
    "xp": 10
  },
  {
    "id": "secq-08",
    "topic": "Avaliação de segurança",
    "difficulty": "Avançado",
    "title": "Como validar uma possível falha de controle de acesso?",
    "context": "Em um laboratório autorizado, duas contas comuns têm identificadores diferentes. Ao trocar um identificador em uma requisição, a conta A consegue ler dados privados da conta B.",
    "options": [
      "Classificar como falha de controle de acesso por objeto e documentar a reprodução",
      "Classificar como ataque de negação de serviço",
      "Concluir que é seguro porque ambas as contas estão autenticadas",
      "Atribuir a falha exclusivamente à criptografia do transporte"
    ],
    "correct": 0,
    "explanation": "O servidor deveria validar a autorização para cada objeto solicitado, e não apenas a existência de uma sessão autenticada. O cenário ilustra acesso indevido a objetos por referência a identificadores.",
    "hint": "Autenticação não significa permissão para acessar dados de outra conta.",
    "xp": 10
  },
  {
    "id": "secq-09",
    "topic": "Identidades e acesso",
    "difficulty": "Intermediário",
    "title": "Como restringir um aplicativo a dispositivos conformes?",
    "context": "Uma empresa utiliza Microsoft Entra ID e deseja que funcionários acessem um aplicativo corporativo somente quando o dispositivo atender às regras de conformidade definidas.",
    "options": [
      "Criar uma política de Acesso Condicional exigindo dispositivo em conformidade",
      "Exigir apenas uma senha longa para todos os usuários",
      "Criar um grupo de distribuição de e-mail",
      "Desativar o registro de dispositivos"
    ],
    "correct": 0,
    "explanation": "O Acesso Condicional pode exigir que o dispositivo seja marcado como em conformidade, normalmente com avaliação de conformidade pelo Intune. Uma senha forte, isoladamente, não avalia a postura do dispositivo.",
    "hint": "Procure um controle que avalie condições no momento do acesso.",
    "xp": 10
  },
  {
    "id": "secq-10",
    "topic": "Identidades e acesso",
    "difficulty": "Intermediário",
    "title": "Qual recurso ajuda a revisar acessos que já foram concedidos?",
    "context": "Um gestor precisa que os responsáveis confirmem periodicamente se colaboradores ainda necessitam pertencer a um grupo que concede acesso a dados financeiros.",
    "options": [
      "Política de retenção de e-mail",
      "Revisões de acesso do Microsoft Entra ID",
      "Lista de bloqueio de DNS",
      "Sincronização de senhas"
    ],
    "correct": 1,
    "explanation": "As revisões de acesso permitem que pessoas designadas reavaliem periodicamente usuários ou associações e tomem decisões sobre a manutenção desses acessos.",
    "hint": "A necessidade é reavaliar concessões existentes, e não apenas autenticar usuários.",
    "xp": 10
  },
  {
    "id": "secq-11",
    "topic": "Identidades e acesso",
    "difficulty": "Avançado",
    "title": "Como reduzir privilégios permanentes de administradores?",
    "context": "Uma equipe quer que uma função administrativa privilegiada seja ativada somente quando necessário, com duração limitada e justificativa, em vez de ficar atribuída de modo ativo o tempo todo.",
    "options": [
      "Adicionar todos os usuários ao grupo de administradores",
      "Manter funções permanentes e ocultar seus nomes",
      "Usar atribuição elegível e ativação pelo Microsoft Entra PIM",
      "Desativar todos os logs de autenticação"
    ],
    "correct": 2,
    "explanation": "No Privileged Identity Management, uma atribuição elegível permite ativação temporária mediante os controles configurados, reduzindo o período de privilégio ativo. Elegibilidade não é o mesmo que atribuição permanentemente ativa.",
    "hint": "A palavra-chave é ativação temporária de uma função privilegiada.",
    "xp": 10
  },
  {
    "id": "secq-12",
    "topic": "Segurança de redes",
    "difficulty": "Intermediário",
    "title": "Qual método de autenticação deve ser preferido na porta de um switch?",
    "context": "Um switch com Cisco ISE autentica computadores corporativos. Há suporte a 802.1X e, para dispositivos legados, existe a possibilidade de usar autenticação por endereço MAC.",
    "options": [
      "Priorizar autenticação por MAC para todos os dispositivos",
      "Desativar RADIUS e usar somente a VLAN padrão",
      "Preferir 802.1X e reservar autenticação por MAC para exceções controladas",
      "Desabilitar a autenticação de porta para acelerar a conexão"
    ],
    "correct": 2,
    "explanation": "O 802.1X usa uma troca de autenticação que pode ser baseada em credenciais ou certificados; a autenticação por MAC não prova a identidade do dispositivo e é vulnerável à falsificação de endereço.",
    "hint": "Considere qual opção oferece prova de identidade mais forte.",
    "xp": 10
  },
  {
    "id": "secq-13",
    "topic": "Segurança de redes",
    "difficulty": "Avançado",
    "title": "Para que serve uma mensagem RADIUS de mudança de autorização?",
    "context": "Uma estação conectada à rede deixa de atender à política de conformidade após uma verificação. O servidor de políticas precisa alterar a condição de acesso sem aguardar uma nova conexão física.",
    "options": [
      "Trocar a chave privada do servidor RADIUS",
      "Solicitar a reavaliação ou mudança da autorização da sessão existente",
      "Estabelecer um túnel IPsec até o cliente",
      "Atualizar registros DNS de forma automática"
    ],
    "correct": 1,
    "explanation": "RADIUS Change of Authorization, ou CoA, permite que o servidor de políticas peça alterações em uma sessão de acesso, frequentemente levando a uma reautorização conforme os recursos do dispositivo de rede.",
    "hint": "A sessão já existe; o objetivo é atualizar sua autorização.",
    "xp": 10
  },
  {
    "id": "secq-14",
    "topic": "Segurança de redes",
    "difficulty": "Avançado",
    "title": "Qual informação pode sustentar uma política baseada em grupos de segurança?",
    "context": "Uma organização usa segmentação baseada em identidade com Cisco TrustSec, evitando depender exclusivamente de endereços IP e VLANs para definir regras entre dispositivos.",
    "options": [
      "A cor do cabo conectado à porta",
      "O nome do arquivo transferido",
      "O endereço físico do roteador de borda",
      "A etiqueta de grupo de segurança atribuída ao tráfego"
    ],
    "correct": 3,
    "explanation": "As Security Group Tags, ou SGTs, identificam grupos de segurança para que políticas de comunicação possam ser aplicadas com base nesses grupos, em vez de depender apenas de endereços IP.",
    "hint": "Pense em uma marcação que representa o grupo ao qual o tráfego pertence.",
    "xp": 10
  },
  {
    "id": "secq-15",
    "topic": "Segurança de redes",
    "difficulty": "Avançado",
    "title": "Qual política controla o tráfego permitido por aplicação em um firewall gerenciado?",
    "context": "Uma equipe administra um Cisco Secure Firewall Threat Defense pelo Firewall Management Center. Ela precisa estabelecer regras sobre aplicações, usuários e redes permitidos ou bloqueados.",
    "options": [
      "Política de controle de acesso com regras adequadas",
      "Política de horário do sistema operacional",
      "Configuração exclusiva do servidor NTP",
      "Tabela de rotas estáticas apenas"
    ],
    "correct": 0,
    "explanation": "A política de controle de acesso do firewall permite decisões sobre o tráfego com base em critérios como zonas, redes e aplicações. Rotas e sincronização de horário não substituem a política de permissão.",
    "hint": "A política decide quais conexões têm permissão para passar.",
    "xp": 10
  },
  {
    "id": "secq-16",
    "topic": "Segurança de redes",
    "difficulty": "Avançado",
    "title": "Qual mecanismo permite transportar IPsec através de NAT?",
    "context": "Dois equipamentos negociam um túnel IPsec, mas um deles fica atrás de um dispositivo que traduz endereços. O túnel precisa encapsular o tráfego protegido para atravessar esse caminho.",
    "options": [
      "Desativar completamente a negociação IKE",
      "Substituir criptografia por HTTP",
      "Usar NAT Traversal com encapsulamento em UDP, normalmente porta 4500",
      "Encaminhar todo o tráfego IPsec por SMTP"
    ],
    "correct": 2,
    "explanation": "O NAT Traversal encapsula ESP em UDP quando a tradução de endereços exige esse recurso, normalmente usando a porta UDP 4500. O uso de NAT-T não elimina autenticação ou criptografia do túnel.",
    "hint": "Procure o encapsulamento de ESP em UDP.",
    "xp": 10
  },
  {
    "id": "secq-17",
    "topic": "Segurança de redes",
    "difficulty": "Intermediário",
    "title": "O que uma proteção baseada em DNS consegue bloquear?",
    "context": "A empresa usa um serviço de segurança DNS e deseja impedir que usuários resolvam domínios conhecidos por hospedar conteúdo malicioso.",
    "options": [
      "Qualquer ataque que utilize somente endereços IP, sem inspeção adicional",
      "Consultas DNS para domínios classificados como maliciosos",
      "Todo arquivo malicioso mesmo quando já está armazenado no computador",
      "Qualquer tráfego criptografado, independentemente de DNS"
    ],
    "correct": 1,
    "explanation": "Uma política de segurança DNS pode negar ou redirecionar a resolução de domínios maliciosos. Ela não substitui proteção de endpoint e não inspeciona automaticamente todo o tráfego que não usa seu resolvedor.",
    "hint": "O ponto de aplicação do controle é a resolução de nomes.",
    "xp": 10
  },
  {
    "id": "secq-18",
    "topic": "Monitoramento e resposta",
    "difficulty": "Intermediário",
    "title": "Qual tabela consultar para investigar processos em endpoints?",
    "context": "Um analista usa a busca avançada do Microsoft Defender XDR e procura processos iniciados em um dispositivo, incluindo nome do executável e linha de comando.",
    "options": [
      "EmailEvents",
      "IdentityLogonEvents",
      "DeviceNetworkInfo",
      "DeviceProcessEvents"
    ],
    "correct": 3,
    "explanation": "DeviceProcessEvents contém eventos relacionados à criação de processos em endpoints, podendo incluir arquivo executável, linha de comando e informações sobre o processo iniciador, conforme a telemetria disponível.",
    "hint": "A pergunta trata de criação de processos, não de e-mail ou login.",
    "xp": 10
  },
  {
    "id": "secq-19",
    "topic": "Monitoramento e resposta",
    "difficulty": "Avançado",
    "title": "Qual consulta filtra eventos de um processo específico?",
    "context": "Em uma investigação de exemplo, o analista precisa retornar eventos de criação do processo powershell.exe nos últimos 60 minutos em uma consulta KQL.",
    "options": [
      "DeviceProcessEvents | where Timestamp > ago(60m) | where FileName =~ \"powershell.exe\"",
      "DeviceProcessEvents | where Timestamp < ago(60m) | where FileName == \"explorer.exe\"",
      "DeviceNetworkEvents | summarize count() by RemotePort",
      "EmailEvents | where Subject contains \"powershell.exe\""
    ],
    "correct": 0,
    "explanation": "A consulta usa DeviceProcessEvents para eventos de processos, filtra os últimos 60 minutos e compara FileName sem diferenciar maiúsculas e minúsculas com o operador =~. As demais alternativas usam outro intervalo, outro evento ou outro processo.",
    "hint": "Observe simultaneamente tabela, intervalo de tempo e nome do arquivo.",
    "xp": 10
  },
  {
    "id": "secq-20",
    "topic": "Monitoramento e resposta",
    "difficulty": "Avançado",
    "title": "Qual ação inicial reduz a comunicação de um endpoint comprometido?",
    "context": "O centro de operações identifica sinais fortes de execução maliciosa em uma estação e precisa reduzir rapidamente a comunicação do dispositivo com outros sistemas, preservando a capacidade de investigar.",
    "options": [
      "Excluir imediatamente todas as evidências locais",
      "Desabilitar todas as políticas de segurança da empresa",
      "Isolar o dispositivo pela ferramenta de resposta do endpoint",
      "Aguardar a próxima reinicialização para decidir"
    ],
    "correct": 2,
    "explanation": "O isolamento do dispositivo pela ferramenta de EDR pode restringir sua comunicação de rede enquanto preserva, conforme o produto e a configuração, canais necessários para gerenciamento e investigação. A medida deve seguir o procedimento de resposta estabelecido.",
    "hint": "É necessário conter a estação, não apagar evidências.",
    "xp": 10
  }
];

export const securityQuiz = {
  id: 'sec-1',
  title: 'Desafios de cibersegurança',
  course: 'Introdução à cibersegurança',
  module: 'Fundamentos e prática',
  minutes: 25,
  completionXP: gamification.lessonXP,
  questions: securityQuestions,
};
