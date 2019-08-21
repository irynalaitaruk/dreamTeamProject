var app = angular.module('app', ['ngRoute', 'ngDialog']);

//забираємо %2F та # з url сайту
app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);
}]);

//створюємо адреси
app.config(function ($routeProvider) {
    $routeProvider
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('myCtrl', function ($scope, $http) {

    //    Загальні дані та глобальні функції і змінні

    //    Перевірка чи залогінений користувач
    $scope.is_logged = false;

    
    $scope.balance = 0;
    
    
    
    
    if (localStorage.user_login == undefined) {
        localStorage.user_login = "default";
        localStorage.user_password = "default";
    } else {
        if (localStorage.user_login != "default") {
            $scope.is_logged = true;
            $scope.user_login = localStorage.user_login;
            $scope.user_name = localStorage.user_name;
            $scope.user_s_name = localStorage.user_s_name;
            $scope.user_email = localStorage.user_email;
        }
    }
    //    В наявності чи залогінений, буде появлятися відповідні сторінки
    $scope.check_is_logged = function () {
        if ($scope.is_logged) {
            $scope.show_welcome = false;
            $scope.show_login = false;
            $scope.show_register_step_one = false;
            $scope.show_register_step_two = false;
            $scope.show_panel = true;
            $scope.show_menu = false;
            $scope.show_home = true;
            $scope.show_account = false;
            $scope.show_history = false;
            $scope.show_statistic = false;
        } else {
            $scope.show_welcome = true;
            $scope.show_login = false;
            $scope.show_register_step_one = false;
            $scope.show_register_step_two = false;
            $scope.show_panel = false;
            $scope.show_menu = false;
            $scope.show_home = false;
            $scope.show_account = false;
            $scope.show_history = false;
            $scope.show_statistic = false;
        }
    }
    $scope.check_is_logged();

    
    // //Масив catExpenses
    // $scope.catExpenses = ["food", "house", "car"];
    //
    //
   
});
//Директива Welcome
app.directive("welcomeBlock", function () {
    return {
        replace: true,
        templateUrl: "template/welcome.html",
        controller: function ($scope) {

            $scope.login_btn = function () {
                $scope.show_welcome = false;
                $scope.show_login = true;
            }

            $scope.register_btn = function () {
                $scope.show_welcome = false;
                $scope.show_register_step_one = true;
            }

        }
    }
});
//Директива Log in
app.directive("loginBlock", function () {
    return {
        replace: true,
        templateUrl: "template/login.html",
        controller: function ($scope, $http) {

            $scope.login_responce = "";


            // Перевірка користувачів

            $scope.log_in = function () {
                
                let log_obj = {
                    login: $scope.user_login,
                    password: $scope.user_password
                }
                
                console.table(log_obj);
                
                $http.post('http://localhost:8000/login', log_obj)
                  .then(function successCallback(response){
                    if(response.data=="Wrong password" || response.data=="Wrong login"){
                        
                        
                        console.log(response.data);
                        $scope.login_responce = response.data;
                    }
                    else{
                        console.log(response.data);
                        $scope.show_login = false;
                        $scope.show_panel = true;
                        $scope.show_home = true;
                        $scope.login_responce = "";
                        localStorage.user_login = $scope.user_login;
                        localStorage.user_password = $scope.user_password;
                        
                        //Дані користувача
                        $scope.AccountData = response.data;
                        
                        console.table($scope.AccountData);
                        
                        localStorage.user_name = $scope.AccountData.name;
                        localStorage.user_s_name = $scope.AccountData.surname;
                        localStorage.user_email = $scope.AccountData.email;
                        localStorage.user_id = $scope.AccountData.id;
                        
                        
                        //підтягуємо дані категорій
                        $scope.get_saves();
                        $scope.get_sources();
                        $scope.get_catExp();
                    }

                  }, function errorCallback(response){
                    console.log("Error: " + response.err);
                  });
                
            }
        }
    }
});

app.directive("registerBlock", function () {
    return {
        replace: true,
        templateUrl: "template/register.html",
        controller: function ($scope, $http) {
            $scope.is_free = false;
            $scope.register_user_login_responce = "Check user name";
            $scope.register_password_responce = "";
            
            $scope.check_user_login = function(){
                
                 let obj1 = {
                     login:$scope.register_user_login
                 }
                
                 $http.post('/check_users', obj1)
                 .then(function successCallback(response){
                    if(response.data){
                        $scope.is_free=true;
                        $scope.register_user_login_responce = "User login is free";
                    }
                    else{
                        $scope.register_user_login_responce = "User login is used";
                    }
                 }, function errorCallback(response){
                      console.log("Error: " + response.err);
                 });
            }
            
            $scope.register_btn_step_1 = function(){
                if($scope.register_user_password_1==$scope.register_user_password_2){
                    $scope.show_register_step_one = false;
                    $scope.show_register_step_two = true;
                }
                else{
                    $scope.register_password_responce = "Password doens`t match";
                }
            }
            
            $scope.register_btn_step_2 = function(){
                
                let final_obj = {
                    login: $scope.register_user_login,
                    password: $scope.register_user_password_2,
                    name: $scope.register_name,
                    surname: $scope.register_second_name,
                    email: $scope.register_e_mail
                };
                
                 $http.post('/register', final_obj)
                 .then(function successCallback(response){
                    if(response.data){
                        alert("Please login");
                        $scope.register_user_login="";
                        $scope.register_user_login_responce="";
                        $scope.register_user_password_1="";
                        $scope.register_user_password_2="";
                        $scope.register_password_responce="";
                        $scope.register_name="";
                        $scope.register_second_name="";
                        $scope.register_e_mail="";
                        
                    }
                 }, function errorCallback(response){
                      console.log("Error: " + response.err);
                 });
                
                $scope.show_register_step_two = false;
                $scope.show_welcome = true;
            }
            
        }
    }
});

app.directive("panelBlock", function () {
    return {
        replace: true,
        templateUrl: "template/panel.html",
        controller: function ($scope, $http) {
            $scope.show_menu = false;
            $scope.menu_btn = function () {
                $scope.show_menu = true;
//                $(".menuBlock").fadeIn();
            }

            //кнопки
            $scope.logout_btn = function () {
                $scope.user_login = "";
                $scope.user_password = "";
                localStorage.user_login = "default";
                localStorage.user_password = "default";

                $scope.is_logged = false;
                $scope.check_is_logged();
            }
            
            
            //обєкт із нашим id коритсувача
            let obj_id = {
                id: localStorage.user_id
            }
            
            //витягуємо сейви
            $scope.get_saves = function(){
                $http.post('http://localhost:8000/get_saves', obj_id)
                    .then(function successCallback(response){
                        let saves_response = response.data;
                        $scope.saves =[];
                        $scope.balance=0;
                    
                    // рахуємо баланс
                        for(var i=0; i<saves_response.length; i++){
                            $scope.balance += +(saves_response[i].sum);
                            $scope.saves.push(saves_response[i]);
                            
                        }
                    }, function errorCallback(response){
                        console.log("Error: " + response.err);
                    });
            }
            $scope.get_saves();
            
            //витягуємо соурси
            $scope.get_sources = function(){
                $http.post('http://localhost:8000/get_sources', obj_id)
                    .then(function successCallback(response){
                        let sources_response = response.data;
                        $scope.sources = [];
                    for(var i=0; i<sources_response.length; i++){
                        $scope.sources.push(sources_response[i].name)
                    }
                    
                    
                    
                    }, function errorCallback(response){
                        console.log("Error: " + response.err);
                    });
            }
            $scope.get_sources();
            
            //витягуємо категорії витрати
            $scope.get_catExp = function(){
                $http.post('http://localhost:8000/get_catExp', obj_id)
                    .then(function successCallback(response){
                        let catExp_response = response.data;
                        $scope.catExp = [];
                    for(var i=0; i<catExp_response.length; i++){
                        $scope.catExp.push(catExp_response[i].name)
                    }
                    
                    
                    
                    }, function errorCallback(response){
                        console.log("Error: " + response.err);
                    });
            }
            $scope.get_catExp();
        }
    }
});

app.directive("menuBlock", function () {
    return {
        replace: true,
        templateUrl: "template/menu.html",
        controller: function ($scope) {
            $scope.show_account = false;
            $scope.show_history = false;
            $scope.show_statistic = false;

            $scope.home_btn = function () {
                $scope.show_account = false;
                $scope.show_home = true;
                $scope.show_history = false;
                $scope.show_statistic = false;
            }
            $scope.account_btn = function () {
                $scope.show_account = true;
                $scope.show_home = false;
                $scope.show_history = false;
                $scope.show_statistic = false;
            }

            $scope.history_btn = function () {
                $scope.show_account = false;
                $scope.show_home = false;
                $scope.show_history = true;
                $scope.show_statistic = false;
            }
            $scope.statistic_btn = function () {
                $scope.show_account = false;
                $scope.show_home = false;
                $scope.show_history = false;
                $scope.show_statistic = true;
            }
        }
    }
});

app.directive("homeBlock", function () {
    return {
        replace: true,
        templateUrl: "template/home.html",
        controller: function ($scope, $http) {
            $scope.income_add = function(){
//                if($scope.income_date==""){
//                    let date = new Date();
//                    var today = date.toLocaleDateString();
//                }
                let home_obj = {
                    date: $scope.income_date,
                    sum: $scope.income_amount,
                    users_id: localStorage.user_id,
                    sources_id: $scope.income_select_source,
                    saves_id: $scope.income_select_save
                }
                $http.post('http://localhost:8000/income_add', home_obj)
                    .then(function successCallback(response){
                        $scope.get_saves();
                        $scope.income_date="";
                        $scope.income_amount="";
                    }, function errorCallback(response){
                        console.log("Error: " + response.err);
                    });
            }
            
            $scope.expence_add = function(){
//                if($scope.expence_date==""){
//                    let date = new Date();
//                    var today = date.toLocaleDateString();
//                }
                let home_obj = {
                    date: $scope.expence_date,
                    sum: $scope.expence_amount,
                    users_id: localStorage.user_id,
                    categoryExp_id: $scope.expence_select_cat_exp,
                    saves_id: $scope.expence_select_exp_save
                }
                $http.post('http://localhost:8000/expence_add', home_obj)
                    .then(function successCallback(response){
                        if(response.data=="error"){
                            alert("Ammount is bigger than saves!")
                        }
                        else{
                            $scope.get_saves();
                            $scope.expence_date = "";
                            $scope.expence_amount = "";
                        }
                    }, function errorCallback(response){
                        console.log("Error: " + response.err);
                    });
            }
        }
    }
});

app.directive("accountBlock", function () {
    return {
        replace: true,
        templateUrl: "template/account.html",
        controller: function ($scope) {}
    }
});

app.directive("historyBlock", function () {
    return {
        replace: true,
        templateUrl: "template/history.html",
        controller: function ($scope, $http) {
            
            $scope.history_array_income =[];
            $scope.history_array_expence =[];
            
            $scope.load_history = function(){
                
                $scope.history_array_income =[];
            $scope.history_array_expence =[];
                
                let obj = {
                    users_id: localStorage.user_id
                }

                $http.post('/get_all_incomes', obj)
                 .then(function successCallback(response){
                    $scope.history_income = response.data;
                    for(var i=0; i<$scope.history_income.length; i++){
                        $scope.history_array_income.push($scope.history_income[i]);
                    }
                    
                    
                 }, function errorCallback(response){
                      console.log("Error: " + response.err);
                 });  
                
                $http.post('/get_all_expences', obj)
                 .then(function successCallback(response){
                    $scope.history_expence = response.data;
                    for(var i=0; i<$scope.history_expence.length; i++){
                        $scope.history_array_expence.push($scope.history_expence[i]);
                    }
                    
                    
                 }, function errorCallback(response){
                      console.log("Error: " + response.err);
                 });  
            }
            
        }
    }
});

app.directive("statisticBlock", function () {
    return {
        replace: true,
        templateUrl: "template/statistic.html",
        controller: function ($scope) {}
    }
});




////////////////////
