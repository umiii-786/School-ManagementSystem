  let filename = document.getElementById('filename')
            let fileInput = document.querySelector('.file')
            let deptname = document.querySelector('#deptname')
            let form = document.querySelector('.options')
            let errormsg = document.querySelector('.errormsg')
            console.log(fileInput)

            function fileSelected(element) {
                console.log(element)
                console.log('event fired ')
                if (element.value != "") {
                    filename.innerHTML = element.value
                }
            }

            function submit_form() {
                if (deptname.value != "" && fileInput.value != "") {
                    form.submit()
                }
                else {
                    errormsg.innerHTML = 'Fill Department name and Select Curriculum'
                }


                setTimeout(() => {
                    errormsg.innerHTML = ''
                }, 1500)
            }