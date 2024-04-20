(module $mathTest
    (func $add (param $a f64) (param $b f64) (result f64)
        local.get $a
        local.get $b
        f64.add
    )
    (export "add" (func $add))
)