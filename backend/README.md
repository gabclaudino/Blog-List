**Blog List Backend**

API RESTful robusta construída com **Node.js**, **Express** e **MongoDB**.

**Funcionalidades**
- **Segurança:** Autenticação via Token (JWT) e criptografia de senhas (Bcrypt).
- **Middlewares:** Extração de usuário e tratamento de erros customizado.
- **Banco de Dados:** Relacionamento entre Blogs e Usuários via Mongoose `populate`.
- **Testes:** Suíte completa de integração com **Jest** e **Supertest**.

**Como rodar**
1. `npm install`
2. Configure o `.env` (MONGODB_URI, SECRET e PORT)
3. `npm run dev`
4. Para testes: `npm test`