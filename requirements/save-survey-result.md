# Responder enquete

> ## Caso de sucesso

1. OK - Recebe uma requisição do tipo **PUT** na rota **/api/surveys/{survey_id}/results**
2. OK - Valida se a requisição foi feita por um **usuário**
3. OK - Valida o parâmetro **survey_id**
4. OK - Valida se o campo **answer** é uma resposta válida
5. OK - **Cria** um resultado de enquete com os dados fornecidos caso não tenha um registro
6. OK - **Atualiza** um resultado de enquete com os dados fornecidos caso já tenha um registro
7. OK - Retorna **200** com os dados do resultado da enquete

> ## Exceções

1. OK - Retorna erro **404** se a API não existir
2. OK - Retorna erro **403** se não for um usuário
3. OK - Retorna erro **403** se o survey_id passado na URL for inválido
4. OK - Retorna erro **403** se a resposta enviada pelo client for uma resposta inválida
5. OK - Retorna erro **500** se der erro ao tentar criar o resultado da enquete
6. OK - Retorna erro **500** se der erro ao tentar atualizar o resultado da enquete
7. OK - Retorna erro **500** se der erro ao tentar carregar a enquete
