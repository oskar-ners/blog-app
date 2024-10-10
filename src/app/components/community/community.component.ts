import { Component, inject, OnInit } from '@angular/core';
import { CommunityService } from '../../services/community.service';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { CommunityMember } from '../../interfaces/community-member.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
})
export class CommunityComponent implements OnInit {
  communityService = inject(CommunityService);
  auth = inject(Auth);

  communityMembers: CommunityMember[] = [];

  ngOnInit(): void {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.communityMembers =
          await this.communityService.getCommunityMembersData();
      }
    });
  }
}
