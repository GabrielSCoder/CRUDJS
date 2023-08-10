const token = "6d573016-d980-4275-b513-60b6e3c1e9fb";
const url = "https://api.box3.work/api/Contato";

let data = null
let idClient = null

//Requisição da lista de contatos
const getData = async () => {
  try {
    const res = await fetch(`${url}/${token}`)
    const json = await res.json()
    
    clearTable()
    json.forEach(createRow)
  }    catch(e) {
      console.error(e)
  }
}

//Deleção
const deleteClient = (id) => {
    fetch(`${url}/${token}/${id}`, { method: "DELETE" })
        .then((res) => {
            if (res.status == 200) {
                updateTable()
            }
        })
        .catch((e) => console.error(e))
}

//PUT
const updateClient = (index, client) => {
    fetch(`${url}/${token}/${index}`, {
        method: "PUT",
        body: JSON.stringify(client),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(() => {
        getData()
    })
    .catch(() => { console.log("Ocorreu um erro na atualização.") })
}

//Salvar um novo cliente
const saveClient = () => {
    if (checkFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            ativo: String(document.getElementById('ativo').checked),
            dataNascimento: document.getElementById('dataNsc').value
        }
        const index = document.getElementById('nome').dataset.index 
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(idClient, client)
            updateTable()
            closeModal()
        }
    }
}

//Limpar a tabela
const clearTable = () => {
    const rows = document.querySelectorAll('#table>tbody tr')
    rows.forEach(row => row.remove())
}

//Criar uma nova linha cliente
const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.className = `tr-${client.id}`
    newRow.innerHTML = `
        <td class="p-2">${client.nome}</td>
        <td>${client.telefone}</td>
        <td>${client.email}</td>
        <td>${client.ativo ? ("<span>Ativado</span>") : ("<span>Desativado</span>") }</td>            
        <td class="text-center">${new Date(client.dataNascimento).toLocaleDateString("pt-BR")}</td>
        <td class="d-flex justify-content-between">
            <button type="button" class="btn btn-primary" id="edit-${client.id}">Editar</button>
            <button type="button" class="btn btn-danger" id="delete-${client.id}">Excluir</button>
        </td>
    `
    document.querySelector('#table>tbody').appendChild(newRow)
}

//Função para limpar a tabela e receber um novo conjunto atualizado de linhas de clientes 
const updateTable = () => {
    clearTable()
    readClient()
}

//Chamada do GET 
const readClient = () => getData()

const createClient = (client) => {
    fetch(`${url}/${token}`, {
        method: "POST",
        body: JSON.stringify(client),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
    })
    .then(() => {
        updateTable()
    })
    .catch(() => {
        console.log("Erro ao criar cliente")
    })
}

//Chamado para editar um cliente com base no index
const editClient = (index) => {
    const client = document.querySelector(`.tr-${index}`)

    const data = {
        nome: client.children[0].innerText,
        telefone: client.children[1].innerText,
        email: client.children[2].innerText,
        ativo: client.children[3].innerText === "Ativado" ? true : false,
        dataNascimento: client.children[4].innerText
    }

    idClient = index
    fillFields(data)
    openModal()
}

//Validação do formulário
const checkFields = () => {
    return document.getElementById('form').reportValidity()
}

//Após fechar o modal os campos são limpos com essa função
const clearFields = () => {
    const fields = document.querySelectorAll('.form-control')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const openModal = () => {
	var myModal = new bootstrap.Modal(document.getElementById('modal'))
	myModal.show()
}

const closeModal = () => {
	clearFields()
}

//A configuração da requisitação post
const config = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {"Content-type": "application/json; charset=UTF-8"}
}

//Passar o formato vindo do json para um formato mais habitual 
const formatDate = (date) => {
    return date.split("/").reverse().join("-")
}

//Inserir os campos do modal
const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('telefone').value = client.telefone
    document.getElementById('email').value = client.email
    document.getElementById('ativo').checked = client.ativo
    document.getElementById('nome').dataset.index = client.index
    document.getElementById('dataNsc').value = formatDate(client.dataNascimento)
}


//Escolha do evento de clique das opções editar (chamara o edit) ou deleção (chama o deleteClient)
const options = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const response = confirm(`Deseja realmente excluir esse cliente?`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

//GET inicial
getData()


//Conjunto dos listeners do crud
document.getElementById('Cadastro')
    .addEventListener('click', openModal)

document.getElementById('Btn-Confirma')
    .addEventListener('click', saveClient)

document.getElementById('Btn-Volta')
    .addEventListener('click', closeModal)

document.querySelector('#table>tbody')
    .addEventListener('click', options)

