const urlBase = 'https://jsonplaceholder.typicode.com/posts'; 
let posts = [];

function getData(){
    fetch(urlBase)
    .then(res => res.json())
    .then(data => {
        posts = data;
        renderPostList();
    })
    .catch(err => console.log('Error al llamar a la API', err));
}

getData();

function renderPostList(){
    const postList = document.getElementById('postList');
    postList.innerHTML = '';
    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('postItem');
        listItem.innerHTML = `
            
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick = 'editPost(${post.id})'>Editar</button>
        <button onclick = 'deletePost(${post.id})'>Eliminar</button>
        <div id='editForm-${post.id}' class='editForm' style='display:none'>
            <label for='editTitle'>Titulo: </label>
            <input type='text' id='editTitle-${post.id}' value='${post.title}' required>
            <label for='editBody'>Comentario: </label>
            <textarea id='editBody-${post.id}' required>${post.body}</textarea>
            <button onclick='updatePost(${post.id})'>Actualizar</button>
        </div>
        `;

        postList.appendChild(listItem);
    }); 

}

function postData(){
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if(postTitle.trim() == '' || postBody.trim() == ''){
        alert('Por favor, complete todos los campos');
        return;
    }

    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(res => res.json())
    .then(data => {
        posts.unshift(data);
        renderPostList();
        postTitleInput.value = '';
        postBodyInput.value = '';
    })
    .catch(err => console.error('Error al crear posteo', err));
}

function editPost(id){
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display === 'none') ? 'block' : 'none';
}

function updatePost(id){
    const editTitle = document.getElementById(`editTitle-${id}`);
    const editBody = document.getElementById(`editBody-${id}`);

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle.value,
            body: editBody.value,
            userId: 1
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(res => res.json())
    .then(data => {
        const index = posts.findIndex(post => post.id === data.id);
        if(index !== -1) 
            {posts[index] = data
        } else {
            alert('Error al actualizar el post');
        };
        renderPostList();
    })
    .catch(err => console.error('Error al actualizar post', err));
}

function deletePost(id){
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        posts = posts.filter(post => post.id !== id);
        renderPostList();
    })
    .catch(err => console.error('Error al eliminar post', err));
}