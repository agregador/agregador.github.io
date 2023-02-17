class CountdownTimer {
    constructor({ selector, targetDate}) {
        this.selector = selector;
        this.targetDate = targetDate;
        this.refs = {
            days: document.querySelector(this.selector).getElementsByClassName("aside-user-value")[0],
            hours: document.querySelector(this.selector).getElementsByClassName("aside-user-value")[1],
            mins: document.querySelector(this.selector).getElementsByClassName("aside-user-value")[2],
            secs: document.querySelector(this.selector).getElementsByClassName("aside-user-value")[3],
        };
    }
    addZero = (number, length) => {
        var num = "" + number;
        while (num.length < length) {
            num = "0" + num;
        }
        return num;
    }
    getTimeRemaining(endtime) {
        const total = Date.parse(endtime) - Date.parse(new Date());
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((total / 1000 / 60) % 60);
        const secs = Math.floor((total / 1000) % 60);
        return { total, days, hours, mins, secs, };
    }
    updateTimer({ days, hours, mins, secs }) {
        this.refs.days.textContent = this.addZero(days, 2);
        this.refs.hours.textContent = this.addZero(hours, 2);
        this.refs.mins.textContent = this.addZero(mins, 2);
        this.refs.secs.textContent = this.addZero(secs, 2);
    }
    startTimer() {
        var x = setInterval(() => {
            const timer = this.getTimeRemaining(this.targetDate);
            this.updateTimer(timer);
            if(timer.total <= 0) {
                const timer = this.getTimeRemaining(new Date());
                this.updateTimer(timer);
                clearInterval(x)
                return
            }
        }, 1000);
    }
}

class UserAuth extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", e => {
            this.initUserAuth();
        });
    }
    initUserAuth = () => {
        const input = document.getElementsByClassName("input-auth-key")[0].value;
        if(input.length == 32) {
            this.getUserStats(URL_ROUTER+"/stats", input);
        } else {
            
        }
    }
    getUserStats = (router, key) => {
        $.ajax({
            type: "GET",
            url: router,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", key);
            },
            success: this.successUserAuth,
            error: this.errorUserAuth
        });
    }
    successUserAuth = (res) => {
        this.setlocalStorage(res);
        this.initUserStats();
    }
    errorUserAuth = (res) => {
        var error = document.createElement("div");
        error.className = "auth-error";
        error.innerHTML = "Chave secreta esta incorreta.";
        document.getElementsByClassName("aside-login-form")[0].insertAdjacentElement("beforeend", error);
    }
    setlocalStorage = (res) => {
        localStorage.setItem(KEY_STORAGE, JSON.stringify(res));
    }
    removelocalStorage = (key) => {
        localStorage.removeItem(key);
    }
    getUserStatus = (expirationAt) => {
        return new Date().toISOString().slice(0,19) < expirationAt.slice(0,19)
    }
    initUserStats = () => {
        const userContent = document.querySelector(".aside-user-logged");
        if (localStorage.getItem(KEY_STORAGE) !== null) {
            var user = JSON.parse(localStorage.getItem(KEY_STORAGE)),
                userStatus = this.getUserStatus(user.expirationAt),
                userStatusLabel = userStatus ? "vip" : "free",
                cardHTML = `<div class="aside-user-data">
                        <div class="aside-user-avatar avatar-morph">
                        <img src="https://via.placeholder.com/80/EFEFEF/000000/" alt="${user.username}">
                        </div>
                        <div class="aside-user-info">
                        <div class="aside-user-name">${user.username}</div>
                        <div class="aside-user-status aside-user-status-${userStatusLabel}">${userStatusLabel}</div>
                        <div class="aside-user-email">${user.email}</div>
                        </div>
                        </div>
                        <div class="aside-user-time-left">
                        <div class="aside-user-item">
                        <div class="aside-user-value">00</div>
                        <div class="aside-user-label">dias</div>
                        </div>
                        <div class="aside-user-colon">:</div>
                        <div class="aside-user-item">
                        <div class="aside-user-value">00</div>
                        <div class="aside-user-label">horas</div>
                        </div>
                        <div class="aside-user-colon">:</div>
                        <div class="aside-user-item">
                        <div class="aside-user-value">00</div>
                        <div class="aside-user-label">minutos</div>
                        </div>
                        <div class="aside-user-colon">:</div>
                        <div class="aside-user-item">
                        <div class="aside-user-value">00</div>
                        <div class="aside-user-label">segundos</div>
                        </div>
                        </div>`;
            userContent.innerHTML = cardHTML;
            document.querySelector(".aside-login-form").innerHTML = `<user-logout class="btn-auth auth-logout">Sair</user-logout>`;
            const timer = new CountdownTimer({
                selector: ".aside-user-logged",
                targetDate: new Date(user.expirationAt),
            });
            timer.startTimer(); 
        } else {
            userContent.innerHTML = `<div class="aside-login-label">Faça o login com sua chave secreta.</div>`;
        }
    }
};
customElements.define("user-auth", UserAuth);

class UserAuthLogout extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", e => {
            this.resetUserAuth();
        });
    }
    resetUserAuth = () => {
        localStorage.removeItem(KEY_STORAGE);
        const userContent = document.querySelector(".aside-user-logged");
        const inputElem = document.querySelector(".aside-login-form");
        const elemHTML = `<div class="aside-form-input auth-login">
                        <input class="input-auth-key" type="text" placeholder="insira aqui sua chave secreta" maxlength="32">
                        <span class="input-focus-border"></span>
                    </div>
                    <div class="aside-form-button auth-login">
                        <user-auth class="btn-auth">Login</user-auth>
                    </div>`;
        inputElem.innerHTML = elemHTML;
        userContent.innerHTML = `<div class="aside-login-label">Faça o login com sua chave secreta.</div>`;
    }
}
customElements.define("user-logout", UserAuthLogout);

var start = new UserAuth();
start.initUserStats();