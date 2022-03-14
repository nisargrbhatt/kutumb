import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserResponse } from 'src/app/interfaces/event';
import { UserLookupComponent } from 'src/app/user-lookup/user-lookup.component';

@Component({
  selector: 'app-user-response-table',
  templateUrl: './user-response-table.component.html',
  styleUrls: ['./user-response-table.component.scss'],
})
export class UserResponseTableComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() responses: UserResponse[] | any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  dataSource: MatTableDataSource<UserResponse> | any;
  displayedColumns: string[] = ['id', 'name', 'count'];

  pageSizeOptions = [10, 20, 50];

  constructor(private dialogService: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.responses);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource(this.responses);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  transformUserId(userId: string): string {
    return userId.slice(0, 4) + '...';
  }

  showUserLookup(userId: string): void {
    this.dialogService.open(UserLookupComponent, {
      data: {
        userId,
      },
      hasBackdrop: true,
      autoFocus: true,
    });
  }
}
