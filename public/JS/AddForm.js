function validateForm() {
    let controls = document.querySelectorAll('.controls')
    let error_labels = document.querySelectorAll('.error-label')
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
    if (count == controls.length) {
        if(controls[4].hasAttribute('min')){
            if(controls[4].value<18 || controls[4].value>65){
                error_labels[4].innerHTML="Age Must in Between 18 and 65"
            }
            else document.querySelector('.registerForm').submit()
        } 
        else  document.querySelector('.registerForm').submit()
    }
}