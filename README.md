**Blog List Application**

Esta é uma aplicação Full Stack desenvolvida como parte do curso Full Stack Open. O projeto consiste em uma plataforma para gerenciar e compartilhar blogs interessantes, permitindo que usuários autenticados postem links, visualizem detalhes e interajam através de "likes".

**Frontend:**
 - React: Biblioteca principal para a interface.

 - Vite: Ferramenta de build rápida para o desenvolvimento frontend.

 - Tailwind CSS: Framework CSS utilitário para estilização.

 - Axios: Cliente HTTP para comunicação com a API.

 - Estado e Efeitos: Uso intensivo de useState, useEffect e useRef para gerenciamento de dados e interações.

**Backend:**
 - Node.js & Express: Ambiente de execução e framework para a construção da API REST.

 - MongoDB & Mongoose: Banco de dados NoSQL e biblioteca de modelagem de objetos para persistência de dados.

 - JWT (JSON Web Tokens): Sistema de autenticação baseado em tokens para rotas protegidas.

 - Bcrypt: Para hashing seguro de senhas no banco de dados.

**A API segue os padrões RESTful e exige autenticação via Header Authorization para operações de escrita:**
 - GET /api/blogs: Retorna todos os blogs.

 - POST /api/blogs: Cria um novo blog (Requer Token).

 - PUT /api/blogs/:id: Atualiza dados de um blog (ex: adicionar likes).

 - DELETE /api/blogs/:id: Remove um blog (Requer Token e validação de dono).

**Testes de Integração:**
O projeto possui uma suíte de testes robusta para o backend utilizando Supertest e Jest. Os testes cobrem:
 - Verificação do formato de resposta (JSON).

 - Validação da criação de blogs com e sem tokens de autorização.

 - Testes de integridade de dados (títulos e URLs obrigatórios).

 - Verificação de criação de usuários e unicidade de nomes de usuário.

 Para rodar os testes:
 Vá ao diretorio do backend e execute `npm test`

**Como executar o Projeto:**
1. Clone o repositório:
    `git clone https://github.com/gabclaudino/Blog-List.git`

2. Instale as dependências (Backend e Frontend):
    `npm install`

3. Configure as variáveis de ambiente: 
    Crie um arquivo `.env` na raiz do backend e defina as seguintes variáveis:
    - `MONGODB_URI`: Sua string de conexão com o MongoDB Atlas.
    - `SECRET`: Uma chave secreta para a geração de tokens JWT.
    - `PORT`: A porta em que o servidor backend será executado (o Vite está configurado por padrão na 3003).

4. Inicie o servidor de desenvolvimento:
    Backend: `npm run dev` (dentro da pasta do backend)
    Frontend: `npm run dev` (dentro da pasta do frontend)



