import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ITask } from 'src/app/Interfaces/ITasks';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskCreateComponent implements OnChanges {

  constructor(private taskService: TasksService) {}

  task: ITask = {
    id: 0,
    title: "Team Meeting",
    description: "Meeting with design team",
    deadline: "2025-05-08",
    priority: "Medium",
    completed: false
  };

  modalTitle: string = "";

  @Input() id: number = 0;
  @Input() visible: boolean = false;
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();


  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    deadline: new FormControl(''),
    priority: new FormControl('low', [Validators.required]),
    completed: new FormControl<boolean>(false, [Validators.required])
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] || changes['id']) {
      if (this.visible) {
        if (this.id && this.id !== 0) {
          this.modalTitle = "Edit Task";
          this.taskService.getTaskById(this.id).subscribe((res) => {
            this.taskForm.get("title")?.setValue(res.title);
            this.taskForm.get("description")?.setValue(res.description ?? null);
            this.taskForm.get("deadline")?.setValue(res.deadline ?? null);
            this.taskForm.get("priority")?.setValue(res.priority);
            this.taskForm.get("completed")?.setValue(res.completed);
          });
        } else {
          this.modalTitle = "Add New Task";
          this.taskForm.reset();
        }
      }
    }
  }

  onSubmit() {
    this.task.title = this.taskForm.value.title!;
    this.task.priority = this.taskForm.value.priority! as 'High' | 'Medium' | 'Low';
    this.task.description = this.taskForm.value.description!;
    this.task.deadline = this.taskForm.value.deadline!;
    this.task.completed = String(this.taskForm.value.completed) === 'true';

    if (this.id && this.id !== 0) {
      
      this.task.id = this.id;
      this.taskService.update(this.id, this.task).subscribe((res) => {
        this.formSubmitted.emit()
      });
    } else {
      
      this.taskService.getAllTask().subscribe((res) => {
        let newId = res.length > 0 ? Math.max(...res.map(x => x.id)) + 1 : 1;
        this.task.id = newId;

        this.taskService.add(this.task).subscribe((res) => {
          this.formSubmitted.emit()
        });
      });
    }
  }
}
