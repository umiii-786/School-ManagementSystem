 function updateCookie(theme) {
        const date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        document.cookie = `theme=${theme};path=/;expires=${date.toUTCString()};`
    }
    function handleTheme() {
        const themeSwitcher = document.getElementById('theme-switch')
        themeSwitcher.checked
        if (themeSwitcher.checked) {
            document.body.classList.remove('light')
            document.body.classList.add('dark')
            updateCookie('dark')
        }
        else {
            document.body.classList.remove('dark')
            document.body.classList.add('light')
            updateCookie('light')

        }
    }

    function getCookieValue(cookieName) {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [name, value] = cookie.split("=");
            if (name === cookieName) {
                return value;
            }
        }
        return null;
    }

    document.onload = setTheme();
    function setTheme() {
        let themebutton = document.getElementById('theme-switch')
        let theme = getCookieValue('theme')
        console.log(theme, "in set theme  on new reload ")
        if (theme == "dark") {
            document.body.classList.remove('light')
            document.body.classList.add('dark')
            themebutton.checked = true
        }
        else {
            document.body.classList.remove('dark')
            document.body.classList.add('light')
            themebutton.checked = false
        }
    }