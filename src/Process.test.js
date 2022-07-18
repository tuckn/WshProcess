/* globals Wsh: false */
/* globals __dirname: false */
/* globals __filename: false */
/* globals process: false */

/* globals describe: false */
/* globals test: false */
/* globals expect: false */

// Shorthand
var CD = Wsh.Constants;
var util = Wsh.Util;
var sh = Wsh.Shell;
var fso = Wsh.FileSystemObject;
var path = Wsh.Path;
var os = Wsh.OS;
var fs = Wsh.FileSystem;

var isArray = util.isArray;
var isEmpty = util.isEmpty;
var isPureNumber = util.isPureNumber;
var isSolidArray = util.isSolidArray;
var isSolidString = util.isSolidString;
var isPlainObject = util.isPlainObject;
var isSameMeaning = util.isSameMeaning;
var includes = util.includes;
var endsWith = util.endsWith;
var TIMEOUT = os.exefiles.timeout;
var CSCRIPT = os.exefiles.cscript;

var _cb = function (fn/* , args */) {
  var args = Array.from(arguments).slice(1);
  return function () { fn.apply(null, args); };
};

describe('Process', function () {
  var testName;

  var network = Wsh.Network;
  if (!network) network = WScript.CreateObject('WScript.Network');

  var COMPNAME = String(network.ComputerName); // %COMPUTERNAME%
  var SYSROOT = String(fso.GetSpecialFolder(CD.folderSpecs.windows)); // %SystemRoot%
  var USERTEMP = String(fso.GetSpecialFolder(CD.folderSpecs.temporary)); // %TEMP% (User)
  var USERNAME = String(network.UserName); // %USERNAME%

  var assetsDir = path.join(__dirname, 'assets');
  var mockWsfCLI = path.join(assetsDir, 'MockCLI.wsf');
  var mockWsfGUI = path.join(assetsDir, 'MockGUI.wsf');

  test('arch', function () {
    expect(isSolidString(process.arch)).toBe(true);
  });

  test('argv, argv0', function () {
    var args = process.argv;
    expect(isSolidArray(args)).toBe(true);
    expect(isSameMeaning(args[0], String(WScript.FullName))).toBe(true);
    expect(isSameMeaning(args[1], String(WScript.ScriptFullName))).toBe(true);

    expect(isSameMeaning(process.argv0, String(WScript.FullName))).toBe(true);
  });

  test('cwd', function () {
    expect(isSameMeaning(process.cwd(), String(sh.CurrentDirectory))).toBe(true);
  });

  test('env', function () {
    var envVals = process.env;
    expect(isEmpty(envVals)).toBe(false);
    expect(isPlainObject(envVals)).toBe(true);
    expect(isSameMeaning(envVals.COMPUTERNAME, COMPNAME)).toBe(true);
    expect(isSameMeaning(envVals.SystemRoot, SYSROOT)).toBe(true);
    expect(isSameMeaning(envVals.TEMP, USERTEMP)).toBe(true);
    expect(isSameMeaning(envVals.TMP, USERTEMP)).toBe(true);
    expect(isSameMeaning(envVals.USERNAME, USERNAME)).toBe(true);
    // expect(isSameMeaning(process.env(), String(sh.CurrentDirectory))).toBe(true);
  });

  test('execPath', function () {
    expect(isSameMeaning(process.execPath, String(WScript.FullName))).toBe(true);
  });

  test('execArgv', function () {
    expect(isArray(process.execArgv)).toBe(true);
    expect(process.execArgv).toContain('//nologo');
    // @TODO
    // expect(process.execArgv).toContain('//job:test:Process');
  });

  testName = 'exit';
  test(testName, function () {
    var TEST_EXIT_MODE0 = '/TEST_EXIT_MODE0';
    var TEST_EXIT_MODE1 = '/TEST_EXIT_MODE1';
    var TEST_EXIT_MODE = '/TEST_EXIT_MODE';

    if (includes(process.argv, TEST_EXIT_MODE0)) {
      process.exit(0);
    } else if (includes(process.argv, TEST_EXIT_MODE1)) {
      process.exit(1);
    } else if (includes(process.argv, TEST_EXIT_MODE)) {
      process.exit();
    }

    var args;
    var iRetVal;

    args = ['//nologo', __filename, '-t', testName, TEST_EXIT_MODE0];
    iRetVal = os.shRunSync(CSCRIPT, args, { winStyle: 'hidden' });
    expect(iRetVal).toBe(0);

    args = ['//nologo', __filename, '-t', testName, TEST_EXIT_MODE1];
    iRetVal = os.shRunSync(CSCRIPT, args, { winStyle: 'hidden' });
    expect(iRetVal).toBe(1);

    args = ['//nologo', __filename, '-t', testName, TEST_EXIT_MODE];
    iRetVal = os.shRunSync(CSCRIPT, args, { winStyle: 'hidden' });
    expect(iRetVal).toBe(0);
  });

  test('kill', function () {
    var oExec = os.shExec(os.exefiles.wscript, ['//nologo', mockWsfGUI]);
    var mockPID = oExec.ProcessID;

    expect(isPureNumber(mockPID)).toBe(true); // Random

    var pObj;
    pObj = os.getProcessObj(mockPID);
    expect(pObj).toBeDefined();
    expect(pObj.ProcessId).toBe(mockPID);

    process.kill(mockPID);

    var msecTimeOut = 3000;
    do {
      pObj = os.getProcessObj(mockPID);
      WScript.Sleep(300);
      msecTimeOut -= 300;
    } while (!isEmpty(pObj) && msecTimeOut > 0);

    expect(isEmpty(pObj)).toBe(true);
  });

  test('pid, ppid', function () {
    var pID = process.pid;
    expect(isPureNumber(pID)).toBe(true); // Random

    var ppID = process.ppid;
    expect(isPureNumber(ppID)).toBe(true); // Random
  });

  test('platform', function () {
    expect(process.platform).toBe('win32');
  });

  test('release', function () {
    // console.dir(process.release);
    expect(isPlainObject(process.release)).toBe(true);
  });

  test('versions, version', function () {
    // console.dir(process.versions);
    expect(isPlainObject(process.versions)).toBe(true);
    expect(isSolidString(process.version)).toBe(true);
  });

  test('wait', function () {
    var waitSec = 3;

    // dry-run
    var retVal = process.wait(waitSec, { isDryRun: true });
    expect(retVal).toContain(TIMEOUT + ' /T 3');

    var startTime = new Date();
    var iRetVal = process.wait(waitSec);
    var endTime = new Date();

    expect(iRetVal).toBe(true);
    var msec = endTime.getTime() - startTime.getTime();
    var tolerance = waitSec * 1000 - msec;
    // +-5 msec -> OK
    expect(tolerance).toBeLessThan(500);

    var errVals = [true, false, undefined, null, NaN, Infinity, '3', [3], {}];
    errVals.forEach(function (val) {
      expect(_cb(process.wait, val)).toThrowError();
    });
  });

  test('restartAsAdmin', function () {
    // dry-run
    var retVal = process.restartAsAdmin({ isDryRun: true });
    var args = process.execArgv.concat(process.argv.slice(1));
    expect(retVal.replace(/["^]/g, '')).toContain('[os.runAsAdmin]: '
      + process.execPath + ' ' + args.join(' ').replace(/["^]/g, '')
    );
  });

  testName = 'isAdmin, restartAsAdmin';
  test(testName, function () {
    var TEST_ADMIN_MODE = '/TEST_ADMIN_MODE';

    var tmpDir = os.makeTmpPath('restartAsAdmin_');
    var copiedPath = path.join(tmpDir, path.basename(mockWsfCLI));
    var symlinkPath = copiedPath + '.symlink';

    if (includes(process.argv, TEST_ADMIN_MODE)) {
      process.restartAsAdmin();

      if (process.isAdmin()) {
        var srcPath = process.argv.find(function (arg) {
          return endsWith(arg, path.basename(mockWsfCLI));
        });

        var linkPath = process.argv.find(function (arg) {
          return endsWith(arg, path.basename('.symlink'));
        });

        fs.linkSync(srcPath, linkPath);
      }

      process.exit(0);
    }

    // Create the tmp directory
    expect(fs.existsSync(tmpDir)).toBe(false);
    fs.mkdirSync(tmpDir);
    expect(fs.existsSync(tmpDir)).toBe(true);

    // Copy the mock file
    expect(fs.existsSync(copiedPath)).toBe(false);
    fs.copyFileSync(mockWsfCLI, copiedPath);
    expect(fs.existsSync(copiedPath)).toBe(true);

    // Create the symlink
    expect(fs.existsSync(symlinkPath)).toBe(false);

    var args = ['//nologo', __filename, '-t', testName, TEST_ADMIN_MODE, copiedPath, symlinkPath];

    os.shRunSync(CSCRIPT, args);

    // Wait for the symlink created
    var created = false;
    var msecTimeOut = 6000;
    do {
      created = fs.existsSync(symlinkPath);
      WScript.Sleep(300);
      msecTimeOut -= 300;
    } while (!created && msecTimeOut > 0);

    expect(created).toBe(true);

    // Clean
    expect(fs.unlinkSync(symlinkPath)).toBe(undefined);
    expect(fs.unlinkSync(copiedPath)).toBe(undefined);
    expect(fs.rmdirSync(tmpDir)).toBe(undefined);
  });

  test('restartAsUser_runAsAdmin', function () {
    // dry-run
    // var retVal = process.restartAsUser({ isDryRun: true });

    expect('@TODO').toBe('tested');
  });
});
