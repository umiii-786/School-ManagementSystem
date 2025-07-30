   let file_input = document.getElementById('profileInput')
            let profileForm = document.querySelector('.profileImg_Form')
            let form = document.querySelector('.options')
            let error_message = document.querySelector('.error_message')
            let search_inputs = document.querySelectorAll('.search_inputs')
            let conducting_lectures = document.querySelectorAll('.lecture-card')
            function select_course() {
                let check = true
                for (let i = 0; i < search_inputs.length; i++) {
                    let value = (search_inputs[i].value).trim()
                    console.log(value)
                    if (value == "") {
                        check = false
                    }
                }
                if (check) form.submit()
            }
            function showUploader() {
                file_input.click()
            }

            function showCourses_input(){
                  if( conducting_lectures.length<5){
                      form.style.opacity=1
                  }
                  else{
                      error_message.innerHTML='Each Teacher Can only teach 5 Courses in Each Session'
                  }
                  setTimeout(()=>{
                        error_message.innerHTML=''
                  },2000)
            }

            function CheckImg() {
                let file = file_input.value
                if (file != "") {
                    profileForm.submit()
                }
            }
