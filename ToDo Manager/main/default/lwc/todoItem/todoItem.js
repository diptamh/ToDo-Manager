import { LightningElement, api } from 'lwc';
import updateTodo from '@salesforce/apex/ToDoController.updateTodo';
import deleteTodo from '@salesforce/apex/ToDoController.deleteTodo';

/**
 * # Public Properties are reactive. If the value of a public property changes, the component rerenders.
 * # To expose a public Property, decorate a field with @api
 */
export default class TodoItem extends LightningElement {

    @api todoId;
    @api todoName;
    @api done = false;


    get containerClass(){
        return this.done ? "todo completed" :"todo upcoming"
    }

    get iconName(){
        return this.done ? "utility:check" : "utility:add";
    }

    updateHandler(){
        const todo = {
            todoId: this.todoId,
            todoName: this.todoName,
            done: !this.done
        };

        updateTodo({payload: JSON.stringify(todo)})
            .then(result => {
                /**
                 * # Commenting out the result null check since it is going to be null as the method has a void return type.
                 */
                //if(result){
                    console.log('Item is updated Successfully');
                    /**
                     * # sending confirmation to the parent component on the completion of the Event
                     */

                    const updateEvent = new CustomEvent('update');
                    this.dispatchEvent(updateEvent);
                //}
            }).catch(error =>{
                console.error('Error in update', error);
            })
    }

    deleteHandler(){
        deleteTodo({todoId: this.todoId})
            .then(result=> {
                /**
                 * # Commenting out the result null check since it is going to be null as the method has a void return type.
                 */
                //if(result){
                    console.log('Item is deleted Successfully');
                    const deleteEvent = new CustomEvent('delete');
                    this.dispatchEvent(deleteEvent);
                //}
            }).catch(error=>{
                console.error('Error in Delete',error);
            })
    }
}