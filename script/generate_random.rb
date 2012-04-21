#!/usr/bin/env ruby

length = 1024
batch_size = 16

# generate our random numbers
set = []
while (length > 0) 
  set.push(rand(255))
  length -= 1
end


# format it
assignment = "Game.Random.stock = "
indent     =                      "    "
rows = []
offset = set.size / batch_size
while (offset > 0) 
  offset -= 1
  subset = set[(offset * batch_size)..((offset + 1) * batch_size - 1)]
   rows.push(indent + subset.map {|n| sprintf("% 4d", n)}.join(","))
end
puts "#{assignment}[\n" + rows.join(",\n") + "\n];"
