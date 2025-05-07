import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITask } from 'src/app/Interfaces/ITasks';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit{

  task : ITask = {
    id: 0,
    title: "",
    description: "",
    deadline: "",
    priority: "Low",
    completed: false
  } 

  id : number = 0
  constructor(private taskService: TasksService , private route: ActivatedRoute , private router : Router){}
  ngOnInit(): void {

    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.taskService.getTaskById(this.id).subscribe((res)=> { 
      this.task.title = res.title
      this.task.priority = res.priority
      this.task.description = res.description
      this.task.deadline = res.deadline
      this.task.completed = res.completed
      console.log(this.task)

    })

  }

  // onEditClicked(id : number){
  //     this.taskService.getTaskById(id).subscribe((res)=> { 
  //     })
  // }

  
  onSubmit(){
      this.taskService.update(this.id , this.task).subscribe((res)=> { 
        this.router.navigate([''])
      })
      
  }

}
