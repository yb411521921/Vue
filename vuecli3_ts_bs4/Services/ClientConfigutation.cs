using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System;
using System.Diagnostics;

public class ClientConfiguration
{
    IHostingEnvironment _env;
    IConfiguration      _conf;
    DateTime            _lastTime;
    long                _lastTicks;
    public ClientConfiguration (IHostingEnvironment env, IConfiguration conf)
    {
        _env = env;
        _conf = conf;
        _lastTime = default(DateTime);
        _lastTicks = 0;
    }
    public string   Environment     => _env.EnvironmentName;
    public bool     UseCompile      => Convert.ToBoolean(_conf["ClientConfiguration:UseCompile"]);

    public int      CpuLoad
    {
        get
        {
            // I know it is a fake not the real CPU load (because of .NET Core limitation)
            var now = DateTime.UtcNow;
            var diff = now.Subtract(_lastTime);
            _lastTime = now;
            var proc = Process.GetCurrentProcess();
            var cpu = proc.TotalProcessorTime;
            long load = (cpu.Ticks - _lastTicks) * 1000 / diff.Ticks;
            _lastTicks = cpu.Ticks;
            return (int)load;
        }
    }
    public string   AsJson
    {
        get
        {
            return $"{{ \"environment\" : \"{Environment}\", \"useCompile\" : \"{UseCompile}\", \"cpuLoad\" : \"{CpuLoad}\" }}";
        }
    }
} 