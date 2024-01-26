import {
  View,
  Text,
  FlatList,
  Keyboard,
  Vibration,
  Pressable,
} from "react-native";
import { Header, Button, Input, Icon } from "@rneui/themed";
import { ListItem } from "@rneui/base";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("addressBook.db");

export default function Address({ navigation }) {
  const [addresses, setAddresses] = useState([]);

  const [inputValue, setInputValue] = useState();

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists addresses (id integer primary key not null, address text);"
        );
      },
      () => console.error("Error when creating DB"),
      updateList
    );
  }, []);

  const save = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into addresses (address) values (?);", [
          inputValue.trim(),
        ]);
      },
      null,
      updateList
    );

    setInputValue("");

    Keyboard.dismiss();
  };

  const updateList = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("select * from addresses;", [], (_, { rows }) =>
          setAddresses(rows._array)
        );
      },
      null,
      null
    );
  };

  const deleteItem = (id) => {
    Vibration.vibrate(200);
    db.transaction(
      (tx) => tx.executeSql("delete from addresses where id = ?;", [id]),
      null,
      updateList
    );
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  return (
    <View style={{ justifyContent: "center" }}>
      <Input
        label="PLACEFINDER"
        placeholder="Type in address"
        value={inputValue}
        onChangeText={(text) => handleInputChange(text)}
      />
      <Button
        raised
        icon={{ name: "save", color: "white" }}
        title={"Save"}
        style={{
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 10,
          marginBottom: 10,
        }}
        onPress={save}
      />
      <FlatList
        data={addresses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ListItem bottomDivider topDivider>
            <ListItem.Content>
              <Pressable
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "90%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                onPress={() =>
                  navigation.navigate("Map", { address: item.address })
                }
                onLongPress={() => deleteItem(item.id)}
              >
                <ListItem.Title>{item.address}</ListItem.Title>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Button
                    title={"Show on map"}
                    style={{ color: "black" }}
                    buttonStyle={{
                      backgroundColor: "transparent",
                    }}
                    titleStyle={{ color: "grey" }}
                    onPress={() =>
                      navigation.navigate("Map", { address: item.address })
                    }
                    onLongPress={() => deleteItem(item.id)}
                  />
                  <Icon type="material" name="chevron-right" color={"grey"} />
                </View>
              </Pressable>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
}
