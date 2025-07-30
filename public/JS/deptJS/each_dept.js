 const members = document.getElementById('members')
            const teacher = document.querySelector('.teachers')
            const select_btn = document.querySelector('.select_btn')
            const form = document.querySelector('.form')
            const alert_message = document.querySelector('.alert_message')
            function showAvailableFaculty() {
                teacher.style.visibility = 'visible'
                select_btn.style.visibility = 'visible'
            }

            function select_faculty() {
                let available_faculty = Array.from(document.querySelectorAll('.faculty_card'))
                const checkedValues = Array.from(document.querySelectorAll('input[name="faculty"]:checked'))
                    .map(cb => cb.value);

                if (checkedValues.length == 0) {
                    showAlert('teachers are not availabe')

                }
                else if (available_faculty.length == 5) {
                    showAlert('Faculty is Completed')

                }
                else if ((available_faculty.length + checkedValues.length) <= 5) {
                    members.value = checkedValues
                    form.submit()

                }
                else {
                    showAlert(`${available_faculty.length} added — ${5 - available_faculty.length} slots left.`)
                }

                console.log(checkedValues);


            }

            function showAlert(text) {
                alert_message.innerHTML = text
                alert_message.style.left = "0px"

                setTimeout(() => {
                    alert_message.style.left = '200%'
                    alert_message.innerHTML = ''
                }, 2000)
            }
