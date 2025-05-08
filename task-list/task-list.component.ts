import { Component, OnInit } from '@angular/core';
import { ITask } from 'src/app/Interfaces/ITasks';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  allTask: ITask[] = [];
  taskVisible: boolean = false;
  taskId: number = 0;

  constructor(private taskService: TasksService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTask().subscribe((res) => {
      this.allTask = res;
    });
  }

  onAddNewTaskClicked() {
    this.taskId = 0;
    this.taskVisible = true;
  }

  onDeleteButtonClicked(id: number) {
    this.taskService.remove(id).subscribe(() => {
      this.loadTasks();
    });
  }

  onEditButtonClicked(id: number) {
    this.taskId = id;
    this.taskVisible = true;
  }

  onFormSubmitted() {
    this.taskVisible = false;
    this.loadTasks();
  }
}
