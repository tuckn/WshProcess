﻿var process=process||{};!function(){var CD=Wsh.Constants,util=Wsh.Util,fso=Wsh.FileSystemObject,path=Wsh.Path,os=Wsh.OS,objAdd=Object.assign,obtain=util.obtainPropVal,isPureNumber=util.isPureNumber,includes=util.includes,TIMEOUT=os.exefiles.timeout,MODULE_TITLE="WshModeJs/Process.js";process.arch=os.arch();var _wsArgs=undefined;process.wsArgs=function(){if(_wsArgs!==undefined)return _wsArgs;_wsArgs=[];for(var i=0,I=WScript.Arguments.length;i<I;i++)_wsArgs.push(String(WScript.Arguments(i)));return _wsArgs}();var _wshExePath=String(WScript.FullName);process.argv=[_wshExePath,__filename].concat(_wsArgs),process.argv0=process.argv[0],process.cwd=function(){return os._cwd},process.env=os.envVars,process.execPath=_wshExePath;var _execArgv=undefined;process.execArgv=function(){if(_execArgv!==undefined)return _execArgv;var args=os.WMI.getThisProcess().CommandLine.split(/\s+/),baseName=path.basename(__filename),idxEnd=args.findIndex(function(arg){if(includes(arg,baseName,"i"))return!0});if(-1===idxEnd)throw new Error("Error: [findIndex -1]:\n  at process.execArgv ("+MODULE_TITLE+')\n  command: "'+baseName+'"\n  baseName: "'+baseName+'"');return _execArgv=args.slice(1,idxEnd)}(),process.exitCode=0,process.exit=function(exitCode){if(1===exitCode)try{WScript.Quit(1)}catch(e){}else if(isNaN(parseInt(exitCode,10)))try{WScript.Quit(0)}catch(e){}else try{WScript.Quit(process.exitCode)}catch(e){}},process.kill=os.terminateProcesses,process.pid=os.getThisProcessID(),process.ppid=os.getThisParentProcessID(),process.platform=os.platform(),process.stdout=function(msgLine){fso.GetStandardStream(CD.stdTypes.out).WriteLine(msgLine)},process.stdin=function(msgLine){},process.stderr=function(errMsg){fso.GetStandardStream(CD.stdTypes.err).WriteLine(errMsg)},process.release={name:ScriptEngine(),sourceUrl:"https://github.com/tuckn/WshModeJs/archive/master.zip"},process.versions={wsh:WScript.Version,jscript:ScriptEngineMajorVersion()+"."+ScriptEngineMinorVersion()+"."+ScriptEngineBuildVersion()},process.version="v"+process.versions.jscript,process.wait=function(waitSec,options){var functionName,typeErrVal,FN="process.wait";isPureNumber(waitSec)||(functionName=FN,typeErrVal=waitSec,util.throwTypeError("number",MODULE_TITLE,functionName,typeErrVal));var retVal=os.runSync(TIMEOUT,["/T",parseInt(waitSec,10)],options);return obtain(options,"isDryRun",!1)?"dry-run ["+FN+"]: "+retVal:retVal===CD.runs.ok},process.isAdmin=os.isAdmin,process.restartAsAdmin=function(options){if(!process.isAdmin()){var FN="process.restartAsAdmin";if(includes(process.argv,"/PREVENTS_INFINITE_LOOP"))throw new Error("Error: [PREVENTS_INFINITE_LOOP]: averted an infinite loop\n  at "+FN+" ("+MODULE_TITLE+")\n  argv: ["+process.argv.join(", ")+"]");var args=process.execArgv.concat(process.argv.slice(1));args.push("/PREVENTS_INFINITE_LOOP");var retVal=os.runAsAdmin(process.execPath,args,objAdd({winStyle:"hidden"},options));if(obtain(options,"isDryRun",!1))return"dry-run ["+FN+"]: "+retVal;process.exit(0)}},process.restartAsUser=function(options){if(process.isAdmin()){var FN="process.restartAsUser";if(includes(process.argv,"/PREVENTS_INFINITE_LOOP"))throw new Error("Error: [PREVENTS_INFINITE_LOOP]: averted an infinite loop\n  at "+FN+" ("+MODULE_TITLE+")\n  argv: ["+process.argv.join(", ")+"]");var args=process.execArgv.concat(process.argv.slice(1));args.push("/PREVENTS_INFINITE_LOOP");var retVal=os.Task.runTemporary(process.execPath,args,options);if(obtain(options,"isDryRun",!1))return"dry-run ["+FN+"]: "+retVal;process.exit(0)}}}();
