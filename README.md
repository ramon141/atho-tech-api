# Atho Tech API

## Executar Aplicação
Execute os comandos:
`cp env_example .env`
- Dentro do arquivo `.env`, que será gerado a partir da cópia do env_example há duas variáveis que podem ser de interesse do progamador alterar.
  - PORT: Essa será a porta que a API abrirá ao executar a aplicação.
  - IP_DOCKER: Esse é o IP local do Docker, geralmente o IP é `172.17.0.1`, em sistemas Linux, para consultar em demais sistemas utilize o comando `ifconfig` (MacOS), `ipconfig` (Windows), `ip addr` (Linux).

`docker-compose up --build`
Este comando realiza as seguintes funções:
- Sobe uma instância do mongodb, na porta 27017
- Utiliza um container baseado na imagem do mongo para introduzir os dados iniciais ao mongodb. Nestes dados contém as informações de usuários. Essa credencial (admin@gmail.com, 123456789) pode ser utilizada na interface.
- Inicia uma instância do Mongo Express, uma interface para utilizar o MongoDB. Para acessar este serviço, basta entrar em http://localhost:8082/.
- Inicia o container com o código da api.

# Variáveis de ambiente:
PRIV_TOKEN_MERCADO_PAGO: Crie um token de pagamento do mercado pago: https://oimark.com.br/base-de-conhecimento/como-gerar-o-token-da-mercado-pago/

CALLBACK_CONFIRM: Altere de acordo com o link de onde o servidor está hospedado. Utilize o ngrok para usar localmente.

IP_DOCKER: Altere de acordo com o IP local do docker.

PORT: Utilize uma porta de sua escolha.