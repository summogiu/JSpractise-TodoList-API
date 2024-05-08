const text = document.querySelector('.text');
const save = document.querySelector('.save');
const list = document.querySelector('.list');
const listBox = document.querySelector('.list-box');
const noCentent = document.querySelector('.no-content p');

apiUrl = 'https://todoo.5xcamp.us';

let todo=[]
let nowType ='all';
let editState = false

//快速測試用
//信箱abc123456@gmail.com
//暱稱abc
//密碼123456


//取得todo資料
function getTodo(){
    axios.get(`${apiUrl}/todos`,{
        headers:{
            Authorization:localStorage.getItem('token')
        }
    })
    .then(res=>{
        todo=res.data.todos
        addContent()
        finishNumRender();
        show(listBox)
        hide(listBox)
    })
    // .catch(err=> console.log(err.response))
}
//渲染
function addContent(){
    const sortTodo = todo.sort((a,b)=>{ //讓已完成的事項往下排
        const checkedA = a.completed_at ? 1 : 0 //如果a.completed_at存在(true) 回傳1 如果不在(null)回傳0
        const checkedB = b.completed_at ? 1 : 0
        return checkedA-checkedB
    })

    let str ='';
    sortTodo.forEach(function(item,index){ 
        item.completed_at ? item.checked = 'checked' : item.checked = 'false'
        
        if(nowType === 'all'){
            str+=`
                <li data-id=${item.id}>
                <label class="finish">
                    <input type="text" class="edit-text">
                    <input type="checkbox" ${item.checked}>
                    <span>${item.content}</span>
                </label>
                <i class="fa-solid fa-pen edit"></i>
                <input type="button" value="╳" class="clear">
                </li>`;
        }
        else if(nowType === item.checked){
            str+=`
                <li data-id=${item.id}>
                <label class="finish">
                    <input type="text" class="edit-text">
                    <input type="checkbox" ${item.checked}>
                    <span>${item.content}</span>
                </label>
                <i class="fa-solid fa-pen edit"></i>
                <input type="button" value="╳" class="clear">
                </li>`;
        }
    
    })
    list.innerHTML = str;        
    text.value ='';
    }
getTodo()

//新增todo資料
function addTodo(content){
    axios.post(`${apiUrl}/todos`,{     
        "todo": {
            "content": content,
            "checked": 'false'
        }        
    },{
        headers:{
            Authorization:localStorage.getItem('token')
        }
    })
    .then(()=>getTodo())
    // .catch(err=> console.log(err.response))
}
save.addEventListener('click',function(e){
    if(text.value.trim()===''){
        alert('請輸入內容');
        return;
    }
    addTodo(text.value)
})

//刪除單筆&編輯內容&切換checked
list.addEventListener('click',function(e){
    let listLi = e.target.closest('li') //選擇目標的父元素
    let todoID = listLi.getAttribute('data-id')

    if(e.target.nodeName !=='INPUT' && e.target.nodeName !== 'I'){
        editState = false
        return
    }else if(e.target.getAttribute('class') =='clear'){
        editState = false
        deleteTodo(todoID)
    }else if(e.target.nodeName =='I'){
        const editText = listLi.querySelector('.edit-text');
        const editTexts = document.querySelectorAll('.edit-text')

       if(editState === false){
            editState = true
            editText.style.display = 'block'
            editText.value = listLi.querySelector('span').textContent
            
        }else if(editState === true && editText.style.display === 'block' ){ //防止編輯中點選其他內容編輯
            if(editText.value.trim()===''){
                alert('請輸入內容')
                return//此時editState必須為ture 不然無法再次進入此判斷式
            }else if(editText.value === listLi.querySelector('span').textContent){
                editState = false
                editText.style.display = 'none'
                return
            }else {
                editState = false
                editText.style.display = 'none'
                editTodo(editText.value,todoID)
            }
            
        }else if(editState === true){
            editTexts.forEach((item)=>item.style.display = 'none')
            editText.style.display = 'block'
            editText.value = listLi.querySelector('span').textContent
        }

    }else if(e.target.getAttribute('class') =='edit-text'){ //防止點選text時觸發勾選
        return
    }else {
        editState = false
        toggleTodo(todoID)
    }
    hide(listBox);
})
//刪除
function deleteTodo(todoID){ 
    axios.delete(`${apiUrl}/todos/${todoID}`,{
        headers:{
            Authorization:localStorage.getItem('token')
        }
    })
    .then(getTodo())
    // .catch(err=> console.log(err.response))
}

//修改todo資料
function editTodo(content,todoID){
    axios.put(`${apiUrl}/todos/${todoID}`,
    {
        "todo": {
            "content": content
        }
    },{
        headers:{
            Authorization:localStorage.getItem('token')
        }
    }
)
    .then(res=>getTodo())
    // .catch(err=> console.log(err.response))
}

//切換代辦狀態(patch請求一定要傳送資料 所以需補上一個空{}才可執行)
function toggleTodo(todoID){   
    axios.patch(`${apiUrl}/todos/${todoID}/toggle`,{},{
        headers:{
            Authorization:localStorage.getItem('token')
        }
    })
    .then(res=>getTodo())
    // .catch(err=> console.log(err.response))
}

//登出
function signOut(){
    axios.delete(`${apiUrl}/users/sign_out`,{
        headers:{
            Authorization:localStorage.getItem('token')
        }
    })
    .then(()=>{
        window.location.href = "index.html";
    })
    // .catch((error)=>console.log(error))
}
const signOutBtn = document.querySelector('.header .right a');
signOutBtn.addEventListener('click',()=>{
    signOut()
})

//顯示名稱
const userName = document.querySelector('.header .right span');
userName.textContent = `${localStorage.getItem('nickname')}的代辦`

//顯示待完成數量
const finishNum = document.querySelector('.finish-num');

function finishNumRender(){ //更新數量
    let undoNum = todo.filter(item => item.checked === 'false' ).length;
    finishNum.textContent = `${undoNum}個待完成項目`;
}

//添加內容時顯示清單
function show(listBox){
    listBox.style.opacity = 1;
    listBox.style.visibility = 'visible';
    noCentent.style.opacity = 0;
}

//檢查是否已無任何代辦內容
function hide(listBox){
    let count = todo.length;
    if( count == 0){
        listBox.style.opacity = 0;
        listBox.style.visibility = 'hidden';
        noCentent.style.opacity = 1;
    }
}

//刪除所有已完成
const clearAll = document.querySelector('.clear-all');

clearAll.addEventListener('click',function(e){
    todo.forEach((item)=>{
        if(item.checked === 'checked'){
            deleteTodo(item.id)
        }
    })
})

//切換分類
const tab = document.querySelector('.state-type');

tab.addEventListener('click',function(e){
    nowType = e.target.getAttribute('class')//判斷目前所在的分類
    getTodo()
})

//按Enter儲存
text.addEventListener("keydown", e =>{
    if (e.keyCode === 13) {
        save.click();
    }
});



