import { Component, ElementRef, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { User } from '../user';

const { BlobServiceClient } = require("@azure/storage-blob");

//Azure Search Service
//const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");

//const client = new SearchClient(
//  "https://workersearchservice.search.windows.net",
 // "azuresql-index",
//  new AzureKeyCredential("2F8851A82C9E1D150CDC27E040B9617D")
//);
//End 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  // Is a user logged in?
  get authenticated(): boolean {
    return this.authService.authenticated;
  }
  // The user
  get user(): User {
    return this.authService.user;
  }

  //The role
  get role(): boolean {
      if((this.authService.user.roles).toString().match('Admin')){
        return true;
      }
      else {
        return false;
      }
  }

  constructor(public authService: AuthService) { }

  ngOnInit() {}

  async signIn(): Promise<void> {
    await this.authService.signIn();

    // Temporary to display the token
    if (this.authService.authenticated) {
      let token = await this.authService.getAccessToken();
    }
  }

  files: FileList;

  onChange(files: FileList) {
      this.files = files;
      // Update <placeholder> with your Blob service SAS URL string
      const blobSasUrl = "https://sekarsacctcentralus.blob.core.windows.net/?sv=2019-12-12&ss=bfqt&srt=sco&sp=rwdlacupx&se=2020-08-31T03:34:08Z&st=2020-08-02T19:34:08Z&spr=https&sig=KLJKv2fSs0f7sSSnf0K2%2B9ewwViItMG2BpKySvqtwpU%3D";
      
      // Create a new BlobServiceClient
      const blobServiceClient = new BlobServiceClient(blobSasUrl);
      
      // Create a unique name for the container by 
      // appending the current time to the file name
      const containerName = "samples-workitems";
      const fileInput = document.getElementById("file-input");
      
      // Get a container client from the BlobServiceClient
      const containerClient = blobServiceClient.getContainerClient(containerName);
            console.log("Uploading files...");
            const promises = [];
            for (let i=0; i < files.length; i++) {
                const blockBlobClient = containerClient.getBlockBlobClient(this.files[i].name);
                promises.push(blockBlobClient.uploadBrowserData(this.files[i]));
            }
            Promise.all(promises);

            alert(`Total Files Successfully Uploaded <<<< ${this.files.length}`);
            console.log("Done..");
      
  }

  doGET() {
    var searchInput = document.getElementById("search-input");
      alert ("Fetching Data ....");
  }
}
