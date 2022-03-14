import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  CollectionReference,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { User } from 'src/app/interfaces/user';
import { UserLookupComponent } from 'src/app/user-lookup/user-lookup.component';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-setting-user',
  templateUrl: './setting-user.component.html',
  styleUrls: ['./setting-user.component.scss'],
})
export class SettingUserComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs = new SubSink();

  users: User[] = [];
  usersCollectionRef: CollectionReference<User | any>;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  dataSource: MatTableDataSource<User> | any;
  displayedColumns: string[] = ['id', 'name', 'email'];

  pageSizeOptions = [10, 20, 50];

  constructor(private afs: Firestore, private dialogService: MatDialog) {
    this.usersCollectionRef = collection(this.afs, `users`);
    this.subs.sink = collectionData<User>(this.usersCollectionRef).subscribe(
      (users) => {
        this.users = users;
        this.dataSource = new MatTableDataSource(this.users);
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.users);
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
