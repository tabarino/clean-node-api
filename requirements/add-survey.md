# Criar enquete

> ## Caso de sucesso

1. OK - Recebe uma requisição do tipo **POST** na rota **/api/surveys**
2. OK - Valida se a requisição foi feita por um **admin**
3. OK - Valida dados obrigatórios **question** e **answers**
4. OK - **Cria** uma enquete com os dados fornecidos
5. OK - Retorna **204**, sem dados

> ## Exceções

1. OK - Retorna erro **404** se a API não existir
2. OK - Retorna erro **403** se o usuário não for admin
3. OK - Retorna erro **400** se question ou answers não forem fornecidos pelo client
4. OK - Retorna erro **500** se der erro ao tentar criar a enquete
