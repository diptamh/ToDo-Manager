import { LightningElement,track } from 'lwc';
import addTodo from '@salesforce/apex/ToDoController.addTodo';
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';


export default class ToDoManager extends LightningElement {
    /**
     * 
     * # Track decorator is used to make the time and the Greeting property reactive
     * # By reactive it means that the properties are sensitive now and they will get updated with the time instantly
     * # Though after Sprint 20 all the private properties are readtive and @Track is not needed.c/toDoManager
     * # Still it is recomended to use @Track decorator for object to listen for changes in the object
     */
    @track time = "";
    @track greeting = "";
    @track todos= [];
    /**
     * 
     * # ConnectedCallback is basically a main method which gets called when the component is initialized
     * 1000 milli sec = 1 sec
     * 
     */
    connectedCallback(){
        //this.populateTodos();
        setInterval(() => {
            this.getTime();
            this.fetchTodos();
            
        }, 1000);
        
    }

    

    getTime(){
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();

        this.time = `${this.getHour(hour)}:${this.getDoubleDigits(min)}:${this.getDoubleDigits(sec)} ${this.getMidDay(hour)}`;

        this.setGreeting(hour);
    }

    getHour(hour){
        return hour === 0 ? 12 : hour > 12 ? (hour-12) : hour;
    }

    getMidDay(hour){
        return hour >= 12 ? "PM" : "AM";
    }

    getDoubleDigits(digit){
        return digit<10 ? "0"+ digit : digit;
    }

    setGreeting(hour){
        if(hour<12){
            this.greeting="Good Morning";
        }else if (hour>= 12 && hour < 17 ){
            this.greeting="Good Afternoon";
        }else {
            this.greeting="Good Evening";
        }
    }

    addToDoHandler(){
        const inputBox = this.template.querySelector("lightning-input");
        /**
         * # Using todo as an Js Object 
         */
        const todo ={
           // todoId: this.todos.length, NOT NEEDED ANY MORE SINCE THIS WILL BE SALESFORCE ID
            todoName: inputBox.value,
            done: false,
            //todoDatae: new Date() NOT NEEDED ANYMORE SINCE THIS WILL BE THE CREATED DATE IN SALESFORCE
        }

        //this.todos.push(todo);
        /**
         * # Not Using array any more as above. Now we will push using apex below
         */
        addTodo({payload : JSON.stringify(todo)}).then(Response => {
            console.log('Item inserted Sucessfully');
            this.fetchTodos();
        }).catch(error => {
            console.error('Error in Inserting ToDo Item'+error);
        })
        /**
         * # The above method returns the promise. Learn about promise in ES5 and ES6.
         * # Go to MDN Javascript Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript
         */
        inputBox.value = "" ;
               
    }
    fetchTodos(){
        getCurrentTodos().then(result => {
            if(result){
                console.log("Retrived todos from server",result.length);
                this.todos= result;
            }
        }).catch(error =>{
            console.error("Error in fetching Todo items"+error);
        })
    }

    /**
     * # Learn JavaScript ES6 and ES7 to get knowledge on how to write efficient code.
     */
    get  upcomingTask(){
        return this.todos && this.todos.length 
            ? this.todos.filter( todo => !todo.done) 
            : [];
    }
    get  completedTask(){
        return this.todos && this.todos.length 
            ? this.todos.filter( todo => todo.done) 
            : [];
    }


    updateHandler() {
        this.fetchTodos();
    }

    deleteHandler() {
        this.fetchTodos();
    }

    populateTodos() {
        const todos=[
            {
                todoId: 0,
                todoName: "Feed the dog",
                done: false,
                todoDatae: new Date()
            },
            {
                todoId: 1,
                todoName: "Feed the cat",
                done: false,
                todoDatae: new Date()
            },
            {
                todoId: 2,
                todoName: "Feed the mat",
                done: false,
                todoDatae: new Date()
            },
            {
                todoId: 3,
                todoName: "Feed the bat",
                done: true,
                todoDatae: new Date()
            },
        ];
        this.todos=todos;
    }

}