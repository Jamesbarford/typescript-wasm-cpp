#include <emscripten/emscripten.h>
#include "LinkedList.cpp"

LinkedList<std::string> ll;

extern "C"
{
    int EMSCRIPTEN_KEEPALIVE say_hey();
    int EMSCRIPTEN_KEEPALIVE main();
}

int say_hey() {
    ll.insert("Foo");
    return ll.get_size();
}


int main(void)
{
    say_hey();
}
