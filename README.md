## CLI for the New DS Cloud

Upload a local project to your DroidScript Cloud apps.

#### Initialize a local project as DS cloud app
```bash
cloud init
```
#### Deploy a project
```bash
cloud deploy
```
The deploy command will upload the all the files and folders within the current working directory. When you select `"NodeJS Server"` project type in initialization, it will upload the project in the **`/apps`** folder. Otherwise, if you select `"Static Website"`, it will upload the project in the **`/public`** folder.

#### Create a nodejs app
```bash
cloud create <app-name>
```
#### Delete a nodejs app
```bash
cloud delete <app-name>
```
#### Clear local cloud data
```bash
cloud reset
```
> This will clear local cloud data including cloud key. So you need to run `cloud init` again.