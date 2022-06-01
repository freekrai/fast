Deno:

```
anon@mini:~/repos/fast$ wrk -t12 -c400 -d30s http://127.0.0.1:8000
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.70ms  568.49us  53.71ms   97.81%
    Req/Sec     8.88k   317.22    12.92k    92.06%
  3183591 requests in 30.02s, 455.42MB read
  Socket errors: connect 0, read 501, write 26, timeout 0
Requests/sec: 106046.54
Transfer/sec:     15.17MB
```

Application:

```
anon@mini:~/repos/fast$ wrk -t12 -c400 -d30s http://127.0.0.1:8000
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.74ms  404.83us  40.94ms   94.41%
    Req/Sec     8.82k   288.29    10.31k    85.22%
  3158906 requests in 30.01s, 451.89MB read
  Socket errors: connect 0, read 621, write 2, timeout 0
Requests/sec: 105246.48
Transfer/sec:     15.06MB
```

Application + Router:

```
anon@mini:~/repos/fast$ wrk -t12 -c400 -d30s http://127.0.0.1:8000
Running 30s test @ http://127.0.0.1:8000
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.90ms  629.47us  62.75ms   98.99%
    Req/Sec     8.41k   349.52    12.40k    93.67%
  3015823 requests in 30.04s, 431.42MB read
  Socket errors: connect 0, read 647, write 0, timeout 0
Requests/sec: 100393.14
Transfer/sec:     14.36MB
```