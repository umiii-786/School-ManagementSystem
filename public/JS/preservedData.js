document.onload=Show_preserveData();
       
        function Show_preserveData(){
            let controls=document.querySelectorAll('.controls')  
            let dataLength=Object.keys(Preserved_data).length
            for (let i = 0; i < dataLength; i++) {
                const eachname=controls[i].getAttribute('name')
                controls[i].value=Preserved_data[eachname]
                console.log("bhai ma hn")
                     
            }        
        }