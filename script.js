
//Variables
var qBank = questionBank; // Use this to change question bank
var abcd = ["A", "B", "C", "D", "E"];
var count = 0;
var points = 0;
var seconds = qBank.length*30;


// Display new question from question array
function displayQuestion(num) {
    if(count > qBank.length-1){
        finalScore();
        return;
    }
    question = qBank[num];
    $("#qNumber").text("Question " + question.id);
    $("#qBody").text(question.body);
    $("#qChoices").empty();
    question.ansChoices.forEach((value, index) => {
        a = $("<a>");
        a.attr("id", abcd[index]);
        a.attr("class", "btn btn-primary d-block w-50 mb-1 text-left");
        a.text(abcd[index] + "\) " + value);
        $("#qChoices").append(a);
    });
}

//Begin the test and set timer based on question array length
function begin() {
    //Use an argument to set qbank when you begin.
    //...
    
    displayQuestion(count);
    $("#begin").empty();

    //Set Timer
    let timer = setInterval( function() {
    $("#timer").text(seconds + " seconds");
    seconds--;
    
    //if seconds expire or count exceeds array length clear the interval and call final score screen
    if (seconds === 0 || count > qBank.length-1){
        clearInterval(timer);
        //Score Function Goes Here
        finalScore();
    }
}, 1000)
}

//Check to see if answer is correct and display answer
function chckAnswer(event) {
    //pull correct answer from question array
    let ans = event.target.id;
    //check if answer is correct angainst targeted choice
    if(ans === qBank[count].correct){
        //if correct increase points and change text
        $("#response").text("correct");
        points+=10;
        $("#points").text(points);
        registerAnswer(); //register the answer
    } else {
        $("#response").text("incorrect");
        seconds-=20;
        registerAnswer(); //register the answer
    }
}

//Increase Count and Display Response On A Timer
function registerAnswer(){

    //Increase Count and Display Next Question
    count++;
    displayQuestion(count);

    //Set Response Timer
    let ansTimer = 1;
    let ansDisplay = setInterval(function() {   
    ansTimer--;
    if(ansTimer === 0){
        console.log(count);
        $("#response").empty();
        clearInterval(ansDisplay);
    }
}, 1000)
}

//Display Final Score
function finalScore() {
    $("#qNumber").text("Final Score: " + points + " points");
    $("#qBody").text("Save your high score!");
    $("#qChoices").empty();
    $("#timer").text("Quiz Complete");
    $("#formSubmit").removeClass("d-none");
}

// Load prexisiting scores from local storage, return array
function loadScores() {
    let savedScores = localStorage.getItem("scores");
    if(savedScores === ""){
        return;
    }
    savedScores = JSON.parse(savedScores);
    console.log(savedScores)
    return savedScores;
}

//send to local storage
function submitScores(event){
    event.preventDefault();
    count=0;
    //pull initials from form
    var initials = $("#inputInitials").val();
    //create array
    let score = {
        "init": initials,
        "score": points,
    }
    //check for existing scores
    //parse returned string 
    let savedScores = loadScores();
    if (savedScores === null){
        //initialize an array for saved score objects to be pushed into
        let scoreArray = [];
        scoreArray.push(score);
        localStorage.setItem("scores", JSON.stringify(scoreArray));
        window.location.replace("./scores.html");
    } else {
    //add to array
    savedScores.push(score);
    //stringify array
    localStorage.setItem("scores", JSON.stringify(savedScores));
    window.location.replace("./scores.html");
    }
}

//display scores in a table
function displayScores() {
    let savedScores = loadScores();
    if (savedScores === null) {
        $("#qBody").text("No Scores Yet, Take The Quiz to see your high score!")
    }
    savedScores.forEach((value, index) =>{
        tr = $("<tr>");
        th = $("<th>");
        th.attr("scope", "row");
        td1 = $("<td>");
        td2 = $("<td>");
        $("#scoreTable").append(tr);
        th.text(index+1);
        tr.append(th);
        td1.text(value.init);
        tr.append(td1);
        td2.text(value.score);
        tr.append(td2);
    });
}

//Event Listeners
$("#begin-button").on("click", begin);
$("div#qChoices").on("click", "a", chckAnswer);
$("form#formSubmit").on("submit", submitScores);