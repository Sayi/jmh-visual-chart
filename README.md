## JMH-visual-chart
基于JMH基准测试实现「一组参数不同方法维度」的可视化度量。

**一组参数不同方法维度** 是指参数在不同取值组合情况下，不同方法的基准测试结果的比较。

### QuickStart
我们以字符串拼接的基准测试为例。

测试在使用加号和StringBuilder时候的字符串拼接的性能情况，拼接次数由变量length指定，分别测试10次、50次和100次的性能，测试代码如下：
```java
@BenchmarkMode(Mode.Throughput)
@Measurement(iterations = 2, time = 6, timeUnit = TimeUnit.SECONDS)
@Threads(4)
@Fork(2)
@Warmup(iterations = 1)
@State(value = Scope.Benchmark)
public class MyBenchmark {

  @Param(value = { "10", "50", "100" })
  private int length;

  @Benchmark
  public void testStringAdd(Blackhole blackhole) {
    String a = "";
    for (int i = 0; i < length; i++) {
      a += i;
    }
    blackhole.consume(a);
  }

  @Benchmark
  public void testStringBuilderAdd(Blackhole blackhole) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < length; i++) {
      sb.append(i);
    }
    blackhole.consume(sb.toString());
  }

  public static void main(String[] args) throws RunnerException {
    Options opt = new OptionsBuilder()
        .include(MyBenchmark.class.getSimpleName())
        .result("result.json")
        .resultFormat(ResultFormatType.JSON).build();

    new Runner(opt).run();
  }
}
```
进入[可视化页面](http://deepoove.com/jmh-visual-chart/)，上传JMH的JSON格式结果文件result.json进行图表渲染：

![](./JMH-Horizontal.png)

支持切换横向视图和垂直视图。

![](./JMH-Vertical.png)

页面URL后加上参数[?theme=default](http://deepoove.com/jmh-visual-chart/?theme=default)会切换成白色主题。

![](./JMH-theme.png)

图表的右上角支持PNG格式图片的下载。

### Why JMH-Visual-chart
[http://jmh.morethan.io/](http://jmh.morethan.io/)是一个非常棒的JMH可视化的页面，提供了「不同方法一组参数维度」的度量。

JMH-Visual-chart尚处于实验性质，我花了几个小时实现了「一组参数不同方法维度」的度量，并且支持一些额外的功能(主题、PNG下载等)。

当有需要的时候，我会回来扩展更多 **维度** 和更多 **样式** 的图表。

### JMH
[OpenJDK Code Tools: jmh](http://openjdk.java.net/projects/code-tools/jmh/)

[Java Microbenchmark Harness Tutorials](http://tutorials.jenkov.com/java-performance/jmh.html)


