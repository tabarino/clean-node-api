# Login

> ## Caso de sucesso

1. OK - Recebe uma requisição do tipo **POST** na rota **/api/login**
2. OK - Valida dados obrigatórios **email** e **password**
3. OK - Valida que o campo **email** é um e-mail válido
4. OK - **Busca** o usuário com o email e senha fornecidos
5. OK - Gera um **token** de acesso a partir do ID do usuário
6. OK - **Atualiza** os dados do usuário com o token de acesso gerado
7. OK - Retorna **200** com o token de acesso e o nome do usuário

> ## Exceções

1. OK - Retorna erro **404** se a API não existir
2. OK - Retorna erro **400** se email ou password não forem fornecidos pelo client
3. OK - Retorna erro **400** se o campo email for um e-mail inválido
4. OK - Retorna erro **401** se não encontrar um usuário com os dados fornecidos
5. OK - Retorna erro **500** se der erro ao tentar gerar o token de acesso
6. OK - Retorna erro **500** se der erro ao tentar atualizar o usuário com o token de acesso gerado
