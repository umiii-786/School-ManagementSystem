     document.querySelectorAll("input[type='radio']")
                        const submit_btn=document.querySelector(".submit_btn")
                        submit_btn.addEventListener('click',submitForm)
                        const form=document.querySelector('.form')
                        let TakeAttendence_student = 0

                        function submitForm(){
                            if(TakeAttendence_student>0){
                                form.submit()
                            }
                            else{
                                alert('yet attendence is not taken')
                            }
                        }
                        function checkedOption(element) {
                            const name_value = element.getAttribute('name')
                            const allnamed_radio = document.querySelectorAll(`input[name='${name_value}']`)
                            console.log("hello word")
                            allnamed_radio.forEach(radio => {
                                radio.removeAttribute("onchange");
                            });

                            ++TakeAttendence_student;
                            document.querySelector('.text_second_part').innerHTML = TakeAttendence_student;
                        }
