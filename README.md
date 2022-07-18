# WshProcess

The process object is a global that provides information about, and control over, the current WSH process. (similar to Node.js Process).

## tuckn/Wsh series dependency

[WshModeJs](https://github.com/tuckn/WshModeJs)  
└─ [WshZLIB](https://github.com/tuckn/WshZLIB)  
&emsp;└─ [WshNet](https://github.com/tuckn/WshNet)  
&emsp;&emsp;└─ [WshChildProcess](https://github.com/tuckn/WshChildProcess)  
&emsp;&emsp;&emsp;└─ WshProcess - This repository  
&emsp;&emsp;&emsp;&emsp;&emsp;└─ [WshFileSystem](https://github.com/tuckn/WshFileSystem)  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;└─ [WshOS](https://github.com/tuckn/WshOS)  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;└─ [WshPath](https://github.com/tuckn/WshPath)  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;└─ [WshUtil](https://github.com/tuckn/WshUtil)  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;└─ [WshPolyfill](https://github.com/tuckn/WshPolyfill)  

The upper layer module can use all the functions of the lower layer module.

## Operating environment

Works on JScript in Windows.

## Installation

(1) Create a directory of your WSH project.

```console
D:\> mkdir MyWshProject
D:\> cd MyWshProject
```

(2) Download this ZIP and unzip or Use the following `git` command.

```console
> git clone https://github.com/tuckn/WshProcess.git ./WshModules/WshProcess
or
> git submodule add https://github.com/tuckn/WshProcess.git ./WshModules/WshProcess
```

(3) Create your JScript (.js) file. For Example,

```console
D:\MyWshProject\
├─ MyScript.js <- Your JScript code will be written in this.
└─ WshModules\
    └─ WshProcess\
        └─ dist\
          └─ bundle.js
```

I recommend JScript (.js) file encoding to be UTF-8 [BOM, CRLF].

(4) Create your WSF packaging scripts file (.wsf).

```console
D:\MyWshProject\
├─ Run.wsf <- WSH entry file
├─ MyScript.js
└─ WshModules\
    └─ WshProcess\
        └─ dist\
          └─ bundle.js
```

And you should include _.../dist/bundle.js_ into the WSF file.
For Example, The content of the above _Run.wsf_ is

```xml
<package>
  <job id = "run">
    <script language="JScript" src="./WshModules/WshProcess/dist/bundle.js"></script>
    <script language="JScript" src="./MyScript.js"></script>
  </job>
</package>
```

I recommend this WSH file (.wsf) encoding to be UTF-8 [BOM, CRLF].

Awesome! This WSH configuration allows you to use the following functions in JScript (_.\\MyScript.js_).

## Usage

Now your JScript (_.\\MyScript.js_ ) can use helper functions to handle file system.
For example, If run the command below

```console
C:\tuckn\test> cscript //nologo D:\MyWshProject\Run.wsf //job:run -n "arg 1"
```

`process` in Run.wsf is

```js
console.log(process.cwd); // C:\tuckn\test
console.log(process.execPath); // C:\Windows\system32\cscript.exe
console.dir(process.execArgv); // ["//nologo", "//job:run"]
console.dir(process.argv);
// Outputs: [
//   "C:\Windows\system32\cscript.exe",
//   "D:\Run.wsf",
//   "-n",
//   "arg 1"]
console.log(process.argv0); // C:\Windows\system32\cscript.exe
console.dir(process.wsArgs); // ["-n", "arg"]

console.dir(process.env);
// Outputs: {
//   ALLUSERSPROFILE: "C:\ProgramData",
//   APPDATA: "C:\Users\UserName\AppData\Roaming",
//   CommonProgramFiles: "C:\Program Files\Common Files",
//   CommonProgramFiles(x86): "C:\Program Files (x86)\Common Files",
//   CommonProgramW6432: "C:\Program Files\Common Files",
//   COMPUTERNAME: "MYPC0123",
//   ComSpec: "C:\WINDOWS\system32\cmd.exe",
//   HOMEDRIVE: "C:",
//   HOMEPATH: "\Users\UserName",
//   ... }
```

```js
process.exitCode = 1;
process.exit(); // This process returns 1 and exits
console.log('Do not reach here');
```

```js
// Terminates all chrome.exe processes.
process.kill('chrome.exe');

// Returns PID of the WSH process
console.log(process.pid); // 38579
console.log(process.ppid); // 12173

// wait
process.wait(5);
// Waiting for 5 sec
console.log('5 seconds have passed.');
```

```js
// restartAsAdmin
if (!process.isAdmin()) process.restartAsAdmin();
console.log('This process is running as admin-authority.');
```

```js
// restartAsUser
if (process.isAdmin()) process.restartAsUser();
console.log('This process is running as user-authority.');
```

Many other functions will be added.
See the [documentation](https://docs.tuckn.net/WshProcess) for more details.

### Dependency Modules

You can also use the following helper functions in your JScript (_.\\MyScript.js_).

- [tuckn/WshPolyfill](https://github.com/tuckn/WshPolyfill)
- [tuckn/WshUtil](https://github.com/tuckn/WshUtil)
- [tuckn/WshPath](https://github.com/tuckn/WshPath)
- [tuckn/WshOS](https://github.com/tuckn/WshOS)
- [tuckn/WshFileSystem](https://github.com/tuckn/WshFileSystem)

## Documentation

See all specifications [here](https://docs.tuckn.net/WshProcess) and also below.

- [WshPolyfill](https://docs.tuckn.net/WshPolyfill)
- [WshUtil](https://docs.tuckn.net/WshUtil)
- [WshPath](https://docs.tuckn.net/WshPath)
- [WshOS](https://docs.tuckn.net/WshOS)
- [WshFileSystem](https://docs.tuckn.net/WshFileSystem)

## License

MIT

Copyright (c) 2020 [Tuckn](https://github.com/tuckn)
