/* globals Wsh: false */
/* globals __filename: false */

if (!process) {
  /**
   * The process object is a global that provides information about, and control over, the current WSH process.
   *
   * @global
   * @namespace
   * @type {object}
   * @requires {@link https://github.com/tuckn/WshOS|tuckn/WshOS}
   */
  var process = {};
}

(function () {
  // Shorthands
  var CD = Wsh.Constants;
  var util = Wsh.Util;
  var fso = Wsh.FileSystemObject;
  var path = Wsh.Path;
  var os = Wsh.OS;

  var objAdd = Object.assign;
  var obtain = util.obtainPropVal;
  var isPureNumber = util.isPureNumber;
  var includes = util.includes;
  var startsWith = Wsh.Util.startsWith
  var TIMEOUT = os.exefiles.timeout;

  /** @constant {string} */
  var MODULE_TITLE = 'WshModeJs/Process.js';

  var throwErrNonNum = function (functionName, typeErrVal) {
    util.throwTypeError('number', MODULE_TITLE, functionName, typeErrVal);
  };

  // process.arch {{{
  /**
   * CPU architecture for Wscript.exe/Cscript.exe was compiled. Similar to {@link https://nodejs.org/api/process.html#process_process_arch|Node.js process.arch}. process.arch = os.arch?
   *
   * @example
   * console.log(process.arch); // amd64
   * @name arch
   * @constant {string}
   * @memberof process
   */
  process.arch = os.arch(); // }}}

  // process.wsArgs {{{
  var _wsArgs = undefined;

  /**
   * Returns an array of specified arguments for the WSH script. This is WScript.Arguments converted to JScript array.
   *
   * @example
   * // Ex. Run the command below
   * // C:\tuckn\test> cscript //nologo D:\Run.wsf //job:test -n "arg 1"
   * console.dir(process.wsArgs);
   * // Output: [
   * //   "-n",
   * //   "arg 1"]
   * @name wsArgs
   * @constant {string[]} - WScript.Arguments
   * @memberof process
   */
  process.wsArgs = (function () {
    if (_wsArgs !== undefined) return _wsArgs;

    _wsArgs = [];

    for (var i = 0, I = WScript.Arguments.length; i < I; i++) {
      _wsArgs.push(String(WScript.Arguments(i)));
    }

    return _wsArgs;
  })(); // }}}

  // process.argv {{{
  var _wshExePath = String(WScript.FullName);

  /**
   * Returns an array containing the process command. Similar to {@link https://nodejs.org/api/process.html#process_process_argv|Node.js process.argv}
   *
   * @example
   * // Ex. Run the command below
   * // C:\tuckn\test> cscript //nologo D:\Run.wsf //job:test -n "arg 1"
   * console.dir(process.argv);
   * // Outputs: [
   * //   "C:\Windows\system32\cscript.exe",
   * //   "D:\Run.wsf",
   * //   "-n",
   * //   "arg"]
   * @name argv
   * @constant {string[]}
   * @memberof process
   */
  process.argv = [_wshExePath, __filename].concat(_wsArgs); // }}}

  // process.argv0 {{{
  /**
   * Returns the original value of argv[0]. Similar to {@link https://nodejs.org/api/process.html#process_process_argv0|Node.js process.argv0}
   *
   * @example
   * // Ex. Run the command below
   * // C:\tuckn\test> cscript //nologo D:\Run.wsf //job:test -n "arg 1"
   * console.log(process.argv0); // C:\Windows\system32\cscript.exe
   * @name argv0
   * @constant {string} - Ex. 'C:\\Windows\\system32\\cscript.exe'
   * @memberof process
   */
  process.argv0 = process.argv[0]; // }}}

  // process.cwd {{{
  /**
   * Returns the current working directory of the WSH process. Similar to {@link https://nodejs.org/api/process.html#process_process_cwd|Node.js process.cwd()}.
   *
   * @example
   * // Ex. Run the command below
   * // C:\tuckn\test> cscript //nologo D:\Run.wsf //job:test -n "arg 1"
   * console.log(process.cwd); // C:\tuckn\test
   * @function cwd
   * @memberof process
   * @returns {string}
   */
  process.cwd = function () {
    return os._cwd;
  }; // }}}

  // process.env {{{
  /**
   * Returns an object containing the user environment. Similar to {@link https://nodejs.org/api/process.html#process_process_env|Node.js process.env}. Alias of {@link https://tuckn.net/docs/WshOS/Wsh.OS.html#.envVars|Wsh.OS.envVars}.
   *
   * @example
   * console.dir(process.env);
   * // Outputs: {
   * //   ALLUSERSPROFILE: "C:\ProgramData",
   * //   APPDATA: "C:\Users\UserName\AppData\Roaming",
   * //   CommonProgramFiles: "C:\Program Files\Common Files",
   * //   CommonProgramFiles(x86): "C:\Program Files (x86)\Common Files",
   * //   CommonProgramW6432: "C:\Program Files\Common Files",
   * //   COMPUTERNAME: "MYPC0123",
   * //   ComSpec: "C:\WINDOWS\system32\cmd.exe",
   * //   HOMEDRIVE: "C:",
   * //   HOMEPATH: "\Users\UserName",
   * //   ... }
   * @name env
   * @memberof process
   * @constant {object}
   * @alias Wsh.OS.envVars
   */
  process.env = os.envVars; // }}}

  // process.execPath {{{
  /**
   * Returns the absolute pathname of the executable that started the WSH process. Similar to {@link https://nodejs.org/api/process.html#process_process_execpath|Node.js process.execPath}.
   *
   * @example
   * // Ex. Run the command below
   * // C:\tuckn\test> cscript //nologo D:\Run.wsf //job:test -n "arg 1"
   * console.log(process.execPath); // C:\Windows\system32\cscript.exe
   * @name execPath
   * @memberof process
   * @constant {string}
   */
  process.execPath = _wshExePath; // }}}

  // process.execArgv {{{
  var _execArgv = undefined;

  /**
   * Returns the set of the WSH options passed when the process was launched. Similar to {@link https://nodejs.org/api/process.html#process_process_execargv|Node.js process.execArgv}.
   *
   * @example
   * // Ex. Run the command below
   * // C:\tuckn\test> cscript //nologo D:\Run.wsf //job:test -n "arg 1"
   * console.dir(process.execArgv);
   * // Output: [
   * //   "//nologo",
   * //   "//job:run"]
   * @name execArgv
   * @memberof process
   * @constant {string[]}
   */
  process.execArgv = (function () {
    if (_execArgv !== undefined) return _execArgv;

    var wmiInstance = os.WMI.getThisProcess();
    var command = wmiInstance.CommandLine;
    var args = command.split(/\s+/);

    _execArgv = args.filter(function (arg) {
      if (startsWith(arg, '//')) return true;
    });

    return _execArgv;
  })(); // }}}

  // process.exitCode {{{
  /**
   * A number which will be the process exit code, when the process either exits gracefully, or is exited via process.exit() without specifying a code. Similar to {@link https://nodejs.org/api/process.html#process_process_exitcode|Node.js process.exitCode}.
   *
   * @example
   * process.exitCode = 1;
   * process.exit();
   * // This process returns 1 and exits
   *
   * console.log('Do not reach here');
   * @memberof process
   * @type {number}
   */
  process.exitCode = 0; // }}}

  // process.exit {{{
  /**
   * Instructs WSH to terminate the process. Similar to {@link https://nodejs.org/api/process.html#process_process_exit_code|Node.js process.exit()}. @todo Support Chakra(JScript11). Chakra can not use WScript.Quit.
   *
   * @example
   * process.exit(1);
   * // This process returns 1 and exits
   *
   * console.log('Do not reach here');
   * @function exit
   * @memberof process
   * @param {number} [exitCode=0] - The exit code.
   * @returns {void}
   */
  process.exit = function (exitCode) {
    // var FN = 'process.exit';
    // if (!isPureNumber(exitCode)) throwErrNonNum(FN, exitCode);

    if (exitCode === 1) {
      try {
        WScript.Quit(1);
      } catch (e) {
        /*  */
      } finally {
        /*  */
      }
    } else if (isNaN(parseInt(exitCode, 10))) {
      try {
        WScript.Quit(0);
      } catch (e) {
        /*  */
      }
    } else {
      try {
        WScript.Quit(process.exitCode);
      } catch (e) {
        /*  */
      } finally {
        /*  */
      }
    }
  }; // }}}

  // process.kill {{{
  /**
   * Sends the signal to the process identified by the PID or the process name. Alias of {@link https://tuckn.net/docs/WshOS/Wsh.OS.html#.terminateProcesses|Wsh.OS.terminateProcesses}. Similar to {@link https://nodejs.org/api/process.html#process_process_kill_pid_signal|Node.js process.kill()}.
   *
   * @example
   * process.kill('chrome.exe');
   * // Terminates all chrome.exe processes.
   * @function kill
   * @memberof process
   * @alias Wsh.OS.terminateProcesses
   */
  process.kill = os.terminateProcesses; // }}}

  // process.pid {{{
  /**
   * Returns the PID of the WSH process. Similar to {@link https://nodejs.org/api/process.html#process_process_pid|Node.js process.pid}.
   *
   * @example
   * console.log(process.pid); // 38579
   * @constant {number}
   * @memberof process
   */
  process.pid = (function () {
    return os.getThisProcessID();
  })(); // }}}

  // process.ppid {{{
  /**
   * Returns the PID of the current parent process. Similar to {@link https://nodejs.org/api/process.html#process_process_ppid|Node.js process.ppid}.
   *
   * @example
   * console.log(process.ppid); // 12173
   * @constant {number}
   * @memberof process
   */
  process.ppid = (function () {
    return os.getThisParentProcessID();
  })(); // }}}

  // process.platform {{{
  /**
   * Returns a string identifying the operating system platform. Similar to {@link https://nodejs.org/api/process.html#process_process_platform|Node.js process.platform}.
   *
   * @example
   * console.log(process.platform); // win32
   * @constant {string}
   * @memberof process
   */
  process.platform = os.platform(); // }}}

  // process.stdout {{{
  /**
   * Output a standard stream. {@link https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/windows-scripting/y6hbz9es(v=vs.84)?redirectedfrom=MSDN|GetStandardStream method}).
   *
   * @example
   * process.stdout('Hello World!');
   * // In Console
   * // Hello World!
   * @function stdout
   * @memberof process
   * @param {string} msgLine - The line message to print.
   */
  process.stdout = function (msgLine) {
    fso.GetStandardStream(CD.stdTypes.out).WriteLine(msgLine);
  }; // }}}

  // process.stdin {{{
  /**
   * [W.I.P] @todo Inputs standard stream. {@link https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/windows-scripting/y6hbz9es(v=vs.84)?redirectedfrom=MSDN|GetStandardStream method}).
   *
   * @function stdin
   * @memberof process
   * @param {string} msgLine - The line message to input.
   */
  process.stdin = function (msgLine) {
    // @TODO fso.GetStandardStream(CD.stdTypes.in).WriteLine(msgLine);
  }; // }}}

  // process.stderr {{{
  /**
   * Outputs error line of standard stream. {@link https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/windows-scripting/y6hbz9es(v=vs.84)?redirectedfrom=MSDN|GetStandardStream method}).
   *
   * @example
   * process.stderr('Error occurred!');
   * // In Console
   * // Error occurred!
   * @function stderr
   * @memberof process
   * @param {string} errMsg - The error message to print.
   */
  process.stderr = function (errMsg) {
    fso.GetStandardStream(CD.stdTypes.err).WriteLine(errMsg);
  }; // }}}

  // process.release {{{
  /**
   * Returns an Object containing metadata related to the current release. Similar to {@link https://nodejs.org/api/process.html#process_process_release|Node.js process.release}.
   *
   * @example
   * console.dir(process.release);
   * // Outputs: {
   * //   name: "JScript",
   * //   sourceUrl: "https://github.com/tuckn/WshModeJs/archive/master.zip" }
   * @constant {string}
   * @memberof process
   */
  process.release = {
    name: ScriptEngine(),
    sourceUrl: 'https://github.com/tuckn/WshModeJs/archive/master.zip'
  }; // }}}

  // process.versions {{{
  /**
   * Returns the WSH version string. Similar to {@link https://nodejs.org/api/process.html#process_process_versions|Node.js process.versions}.
   *
   * @example
   * console.dir(process.versions);
   * // Outputs: {
   * //   wsh: "5.812",
   * //   jscript: "5.8.16384" }
   * @constant {string}
   * @memberof process
   */
  process.versions = {
    wsh: WScript.Version,
    jscript: ScriptEngineMajorVersion() + '.' + ScriptEngineMinorVersion() + '.' + ScriptEngineBuildVersion()
  }; // }}}

  // process.version {{{
  /**
   * Returns the WSH version string. Similar to {@link https://nodejs.org/api/process.html#process_process_version|Node.js process.version}.
   *
   * @example
   * console.log(process.version); // v5.8.16384
   * @constant {string}
   * @memberof process
   */
  process.version = 'v' + process.versions.jscript; // }}}

  // process.wait {{{
  /**
   * Stops the process for the specified number of seconds. The difference from WScript.Sleep, Shows a countdown window.
   *
   * @example
   * process.wait(5);
   * // Waiting for 5 sec
   *
   * console.log('5 seconds have passed.');
   * @function wait
   * @memberof process
   * @param {number} waitSec - The waiting sec.
   * @param {object} [options] - Optional Parameters.
   * @param {(number|string)} [options.winStyle=activeDef] - See {@link https://tuckn.net/docs/WshUtil/Wsh.Constants.windowStyles.html|Wsh.Constants.windowStyles}.
   * @param {boolean} [options.isDryRun=false] - No execute, returns the string of command.
   * @returns {boolean|string} - If canceled the wait, returns false, else true. If isDryRun is true, returns the command log string. Not execute.
   */
  process.wait = function (waitSec, options) {
    var FN = 'process.wait';
    if (!isPureNumber(waitSec)) throwErrNonNum(FN, waitSec);

    var retVal = os.shRunSync(TIMEOUT, ['/T', parseInt(waitSec, 10)], options);

    var isDryRun = obtain(options, 'isDryRun', false);
    if (isDryRun) return 'dry-run [' + FN + ']: ' + retVal;

    return retVal === CD.runs.ok;
  }; // }}}

  // process.isAdmin {{{
  /**
   * Checks if this process is running as Administrator authority. Alias of {@link https://tuckn.net/docs/WshOS/Wsh.OS.html#.isAdmin|Wsh.OS.isAdmin}.
   *
   * @example
   * process.isAdmin(); // false
   * @function isAdmin
   * @memberof process
   * @alias Wsh.OS.isAdmin
   * @returns {boolean}
   */
  process.isAdmin = os.isAdmin; // }}}

  // process.restartAsAdmin {{{
  /**
   * Executes the self process as HighWIL. and die
   *
   * @example
   * if (!process.isAdmin()) process.restartAsAdmin();
   *
   * console.log('This process is running as admin-authority.');
   * @function restartAsAdmin
   * @memberof process
   * @param {object} [options] - Optional Parameters.
   * @param {boolean} [options.isDryRun=false] - No execute, returns the string of command.
   * @returns {void|string} - If isDryRun is true, returns the command log string. Not execute.
   */
  process.restartAsAdmin = function (options) {
    if (process.isAdmin()) return;

    var FN = 'process.restartAsAdmin';
    var PREVENT_WORD = '/PREVENTS_INFINITE_LOOP';

    if (includes(process.argv, PREVENT_WORD)) {
      throw new Error('Error: [PREVENTS_INFINITE_LOOP]: averted an infinite loop\n'
        + '  at ' + FN + ' (' + MODULE_TITLE + ')\n'
        + '  argv: [' + process.argv.join(', ') + ']');
    }

    var args = process.execArgv.concat(process.argv.slice(1));
    args.push(PREVENT_WORD); // Averted an infinite loop

    var retVal = os.runAsAdmin(
      process.execPath, args, objAdd({ winStyle: 'hidden' }, options)
    );

    var isDryRun = obtain(options, 'isDryRun', false);
    if (isDryRun) return 'dry-run [' + FN + ']: ' + retVal;

    process.exit(0);
  }; // }}}

  // process.restartAsUser {{{
  /**
   * Executes calling the self process as Medium WIL. and die
   *
   * @example
   * if (process.isAdmin()) process.restartAsUser();
   *
   * console.log('This process is running as user-authority.');
   * @function restartAsUser
   * @memberof process
   * @param {object} [options] - Optional Parameters.
   * @param {boolean} [options.isDryRun=false] - No execute, returns the string of command.
   * @returns {void|string} - If isDryRun is true, returns the command log string. Not execute.
   */
  process.restartAsUser = function (options) {
    if (!process.isAdmin()) return;

    var FN = 'process.restartAsUser';
    var PREVENT_WORD = '/PREVENTS_INFINITE_LOOP';

    if (includes(process.argv, PREVENT_WORD)) {
      throw new Error('Error: [PREVENTS_INFINITE_LOOP]: averted an infinite loop\n'
        + '  at ' + FN + ' (' + MODULE_TITLE + ')\n'
        + '  argv: [' + process.argv.join(', ') + ']');
    }

    var args = process.execArgv.concat(process.argv.slice(1));
    args.push(PREVENT_WORD); // Averted an infinite loop

    /*
     * @note When executed on Task Scheduler, Runs as User privilege.
     */
    var retVal = os.Task.runTemporary(process.execPath, args, options);

    var isDryRun = obtain(options, 'isDryRun', false);
    if (isDryRun) return 'dry-run [' + FN + ']: ' + retVal;

    process.exit(0);
  }; // }}}
})();

// vim:set foldmethod=marker commentstring=//%s :
