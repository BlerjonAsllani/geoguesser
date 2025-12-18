package com.example.class_objects;

// Plan / Class of the house
public class House {

    // Attributes of the house
    private String familyName;
    private String street;
    private int houseNumber;
    private int numberOfRooms;
    private double price;

    // initializes a new house-object (default constructor)
    public House() {
        familyName = "";
        street = "";
        houseNumber = 0;
        numberOfRooms = 0;
        price = 0.0;
    }

    // Getter und Setter
    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public int getHouseNumber() {
        return houseNumber;
    }

    public void setHouseNumber(int houseNumber) {
        this.houseNumber = houseNumber;
    }

    public int getNumberOfRooms() {
        return numberOfRooms;
    }

    public void setNumberOfRooms(int numberOfRooms) {
        this.numberOfRooms = numberOfRooms;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    // toString Methode
    @Override
    public String toString() {
        return "House{" +
                "familyName='" + familyName + '\'' +
                ", street='" + street + '\'' +
                ", houseNumber=" + houseNumber +
                ", numberOfRooms=" + numberOfRooms +
                ", price=" + price +
                '}';
    }
}