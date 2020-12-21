OUT_DIR=./client/wasm_modules
CPP_SRC=./client/cpp_src
LINK_TARGET=$(OUT_DIR)/main.js
SRC_FILES=$(shell find ./$(CPP_SRC)/main.cpp)
OBJS=$(patsubst ./$(CPP_SRC)/.cpp, $(OUT_DIR)/%.wasm, $(SRC_FILES))
REBUILDABLES=$(OBJS) $(LINK_TARGET)
CC_FLAGS=-std=c++17 -s EXPORT_ALL=1 -s WASM=1 -s STANDALONE_WASM -O3
CC=em++

all: $(LINK_TARGET)
	@echo "compilation success ✅"

$(LINK_TARGET): $(OBJS)
	$(CC) $(CC_FLAGS) -o $@ $^

$(OUT_DIR)/%.js: $(OUT_DIR)%.cpp
	$(CC) $(CC_FLAGS) -o $@ -c $<

clean:
	rm -f $(OUT_DIR)/*
	@echo "clean done ✨"