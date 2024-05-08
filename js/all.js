const apiUrl = 'https://todoo.5xcamp.us';

const signUpBtn = document.querySelector('.signUp-btn');
    const signUpBoxInput = document.querySelectorAll('.signUp-box .enter-input');
    const signUpBoxSpan = document.querySelectorAll('.signUp-box .hints');
    const signUpEmailHints = document.querySelector('.signUp-email-hints');
    const signUpEmail = document.querySelector('.signUp-email');
    const signUpNickname = document.querySelector('.signUp-nickname');
    const signUpPwd = document.querySelector('.signUp-pwd');
    const signUpPwdCheck = document.querySelector('.signUp-pwd-check');   
const signInBtn = document.querySelector('.signIn-btn');
    const signInBoxInput = document.querySelectorAll('.signIn-box .enter-input');
    const signInBoxSpan = document.querySelectorAll('.signIn-box span');
    const signInEmail = document.querySelector('.signIn-email');
    const signInPwd = document.querySelector('.signIn-pwd');
    const signInPwdHints = document.querySelector('.signIn-pwd-hints');
let token='';
let nickname =''

//註冊
function signUp(email,nickname,pwd){
    axios.post(`${apiUrl}/users`,{
        "user": {
          "email": email,
          "nickname": nickname,
          "password": pwd
        }
      })
      .then(()=> {
        Swal.fire({
            icon: "success",
            title: "註冊成功",
            text: `歡迎您的加入!${nickname}！`,
            footer: '<a href="index.html">移動到登入頁面</a>'
          });
          signUpBoxInput.forEach((item)=>item.value = '')
    })
      .catch(err=> {
        console.log(err.response.data)
        let SignUpError = err.response.data.error;
        SignUpError.forEach((item)=>{
            if(item === '電子信箱 已被使用'){
                signUpEmailHints.textContent = `此電子信箱已被註冊`
            }else if(item === '電子信箱 格式有誤'){
                signUpEmailHints.textContent = `電子信箱格式有誤`
            }
        })
        
    })
}

if(signUpBtn){
signUpBtn.addEventListener('click',()=>{
    let isCheck = true
    signUpBoxInput.forEach((item,index)=>{
        if (item.value ===''){
            signUpBoxSpan[index].textContent = `此欄位不可為空`
            isCheck = false
        }else if(signUpPwd.value.length < 6 && item.getAttribute('data-type') === 'signUp-pwd'){
            signUpBoxSpan[index].textContent = `密碼需大於6個字`
            isCheck = false
        }else if(signUpPwd.value !== signUpPwdCheck.value && item.getAttribute('data-type') === 'signUp-pwd-check'){
            signUpBoxSpan[index].textContent = `密碼不正確`
            isCheck = false
        }   
        else{
            signUpBoxSpan[index].textContent = ``
        }
    })
    if(isCheck) signUp(signUpEmail.value,signUpNickname.value,signUpPwd.value)
})


signUpPwdCheck.addEventListener("keydown", e =>{
    if (e.keyCode === 13) {
        signUpBtn.click();
    }
});
}

//登入
function signIn(email,pwd){
    axios.post(`${apiUrl}/users/sign_in`,{
        "user": {
            "email": email,
            "password": pwd
        }
    })
    .then(res=> {
        axios.defaults.headers.common['Authorization'] = res.headers.authorization
        console.log(res)
        token = res.headers.authorization
        localStorage.setItem('token', token)
        nickname = res.data.nickname
        localStorage.setItem('nickname', nickname)
        window.location.href = "todoList.html";
    })
    .catch(err=> {
        console.log(err.response.data.message)
        let SignInError = err.response.data.message;
        if(signInPwd.value !== '' && signInEmail.value !== ''){
            signInPwdHints.textContent = `帳號或密碼錯誤`
        }
    })
}

if(signInBtn){
signInBtn.addEventListener('click',()=>{
    let isCheck = true
    signInBoxInput.forEach((item,index)=>{
        if (item.value ===''){
            signInBoxSpan[index].textContent = `此欄位不可為空`
            isCheck = false
        }else{
            signInBoxSpan[index].textContent = ``
        }
    })
    if(isCheck) signIn(signInEmail.value,signInPwd.value)
})

signInPwd.addEventListener("keydown", e =>{
    if (e.keyCode === 13) {
        signInBtn.click();
    }
});
}



//快速測試用
//signUp('abc123456@gmail.com','abc','123456');
//signIn('abc123456@gmail.com','123456');
//getTodo()