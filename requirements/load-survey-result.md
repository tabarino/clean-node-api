# Resultado da enquete

> ## Caso de sucesso

1. OK - Recebe uma requisição do tipo **GET** na rota **/api/surveys/{survey_id}/results**
2. OK - Valida se a requisição foi feita por um **usuário**
3. OK -Retorna **200** com os dados do resultado da enquete

> ## Exceções

1. OK - Retorna erro **404** se a API não existir
2. OK - Retorna erro **403** se não for um usuário
3. OK - Retorna erro **500** se der erro ao tentar listar o resultado da enquete
