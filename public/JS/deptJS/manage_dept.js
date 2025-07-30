console.log(typeof(departments))
    console.log(departments)
    let input = document.querySelector('.search_inputs')
    let all_departments = document.querySelector('.all_departments')
    function searchDepartment() {
        let querry = (input.value).trim()
        if (querry != "") {
            FilterData(departments,querry)
        }

    }
    function FilterData(departments,querry) {
        let filtered_data= departments.filter( (element)=> {
            return element.departmentName.includes(querry);
        });
        all_departments.innerHTML=''
        for(let i=0;i<filtered_data.length;i++){
            all_departments.innerHTML+=`
              <div class="each_department">
                        <div class="deptname">
                            ${filtered_data[i].departmentName}
                        </div>
                        <div class="total_Students">Totals Students</div>
                        <div class="total_Students">
                            ${filtered_data[i].studentCount}
                        </div>
                        <a class='button profile_button' href='/department/${filtered_data[i].departmentId}  %>'>
                            View
                        </a>
                    </div>
            `
        }
        console.log(filtered_data)
    }