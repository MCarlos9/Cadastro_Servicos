let editIndex = null;

document.getElementById('serviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        cliente: document.getElementById("cliente").value,
        contato: document.getElementById("contato").value,
        servico: document.getElementById("servico").value,
        descricao: document.getElementById("descricao").value,
        status: document.getElementById("status").value
    };

    if (editIndex === null) {
        // Criar novo
        await fetch("/api/servicos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    } else {
        // Editar existente
        await fetch(`/api/servicos/${editIndex}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        editIndex = null;
        document.getElementById("btnSalvar").textContent = "Cadastrar";
    }

    document.getElementById("serviceForm").reset();
    carregarServicos();
});

// Carregar serviços
async function carregarServicos() {
    const resp = await fetch("/api/servicos");
    const servicos = await resp.json();

    const tabela = document.getElementById("listaServicos");
    tabela.innerHTML = "";

    servicos.forEach((s, i) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${s.cliente}</td>
            <td>${s.contato}</td>
            <td>${s.servico}</td>
            <td>${s.status}</td>
            <td>
                <button class="editar" onclick="editar(${i})">Editar</button>
                <button class="excluir" onclick="excluir(${i})">Excluir</button>
            </td>
        `;

        tabela.appendChild(tr);
    });
}

// Editar serviço
async function editar(i) {
    const resp = await fetch("/api/servicos");
    const servicos = await resp.json();
    const s = servicos[i];

    document.getElementById("cliente").value = s.cliente;
    document.getElementById("contato").value = s.contato;
    document.getElementById("servico").value = s.servico;
    document.getElementById("descricao").value = s.descricao;
    document.getElementById("status").value = s.status;

    editIndex = i;
    document.getElementById("btnSalvar").textContent = "Salvar Edição";
}

// Excluir serviço
async function excluir(i) {
    await fetch(`/api/servicos/${i}`, {
        method: "DELETE"
    });

    carregarServicos();
}

carregarServicos();