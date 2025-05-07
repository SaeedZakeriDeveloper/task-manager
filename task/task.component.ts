import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ITask } from 'src/app/Interfaces/ITasks';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskCreateComponent {

  modalTitle: string = "" 
  @Input() id: number=0;

  private _visible: boolean = false;

  @Input()
  set visible(val: boolean) {
    this._visible = val;
    this.onVisibleChange(val);
  }

  get visible(): boolean {
    return this._visible;
  }

  onVisibleChange(newValue: boolean) {
    if (newValue) {
      if (this.id) {
        this.modalTitle = "Edit Task"
        this.taskService.getTaskById(this.id).subscribe((res) => {
          this.taskForm.get("title")?.setValue(res.title);
          this.taskForm.get("description")?.setValue(res.description ?? null)
          this.taskForm.get("deadline")?.setValue(res.deadline ?? null)
          this.taskForm.get("priority")?.setValue(res.priority)
          this.taskForm.get("completed")?.setValue(res.completed)
        })
      } else {
        this.modalTitle = "Add New Task"
        this.taskForm.reset()
      }

    } else {

    }
  }

  task: ITask = {
    id: 0,
    title: "Team Meeting",
    description: "Meeting with design team",
    deadline: "2025-05-08",
    priority: "Medium",
    completed: false
  }

  constructor(private taskService: TasksService, private router: Router) {
    console.log('tesst')
  }


  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    deadline: new FormControl(''),
    priority: new FormControl('low', [Validators.required]),
    completed: new FormControl<boolean>(false, [Validators.required])
  });


  onSubmit() {
    this.taskService.getAllTask().subscribe((res) => {
      let id = Math.max(...res.map(x => x.id))
      this.task.id = id + 1
      this.task.title = this.taskForm.value.title!
      this.task.priority = this.taskForm.value.priority! as 'High' | 'Medium' | 'Low';
      this.task.description = this.taskForm.value.description!
      this.task.deadline = this.taskForm.value.deadline!
      this.task.completed = String(this.taskForm.value.completed) === 'true';

      this.taskService.add(this.task).subscribe((res) => {
        this.router.navigate([''])
      })
    })


  }

  onShowAllTaskButtonClicked() {
    this.router.navigate(['/'])
  }
}
