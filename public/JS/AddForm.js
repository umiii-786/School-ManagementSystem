
let controls = document.querySelectorAll('.controls')
let error_labels = document.querySelectorAll('.error-label')
let Info_message_popup = document.querySelector('.Info_message_popup')
let cnic=document.getElementById('cnic')
let purpose=document.getElementById('purpose')
function validateForm() {
   

    let count = 0

    for (let i = 0; i < controls.length; i++) {
        if (controls[i].value == "") {
            error_labels[i].innerHTML = "Field Should not be Empty"
        }
        else {
            controls[i].style.boxShadow = "0px 0px 3px 0px green"
            error_labels[i].innerHTML = ""
            count++;
        }
    }

    //alert(controls.length,'----',count)
    if (count == controls.length) {
        if(purpose.innerText!='edit'){
                    if(controls[4].hasAttribute('min')){
                        if(controls[4].value<18 || controls[4].value>65){
                            error_labels[4].innerHTML="Age Must in Between 18 and 65"
                        }
                        else check_in_db(cnic.value)
                    } 
                    else   check_in_db(cnic.value)
           } 
           else{
             document.querySelector('.registerForm').submit()
           }
    }
}

async function check_in_db(cnic){
    const response=await fetch('/check/user',{
        headers:{
            'Content-Type': 'application/json'
        },
        method:"POST",
        body:JSON.stringify({'cnic':cnic})
    })
    const result=await response.text()
    console.log(result)
    if(result=="not_exist"){
        document.querySelector('.registerForm').submit()
    }
    else{
        Info_message_popup.innerText='user with Same Cnic Already exist '
    }
    setTimeout(()=>{
        Info_message_popup.innerText=''
    },2000)

}