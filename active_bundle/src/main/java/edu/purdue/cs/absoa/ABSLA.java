/**
 * Autogenerated by Thrift Compiler (0.9.1)
 *
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
 *  @generated
 */
package edu.purdue.cs.absoa;

import org.apache.thrift.scheme.IScheme;
import org.apache.thrift.scheme.SchemeFactory;
import org.apache.thrift.scheme.StandardScheme;

import org.apache.thrift.scheme.TupleScheme;
import org.apache.thrift.protocol.TTupleProtocol;
import org.apache.thrift.protocol.TProtocolException;
import org.apache.thrift.EncodingUtils;
import org.apache.thrift.TException;
import org.apache.thrift.async.AsyncMethodCallback;
import org.apache.thrift.server.AbstractNonblockingServer.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.EnumMap;
import java.util.Set;
import java.util.HashSet;
import java.util.EnumSet;
import java.util.Collections;
import java.util.BitSet;
import java.nio.ByteBuffer;
import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ABSLA implements org.apache.thrift.TBase<ABSLA, ABSLA._Fields>, java.io.Serializable, Cloneable, Comparable<ABSLA> {
  private static final org.apache.thrift.protocol.TStruct STRUCT_DESC = new org.apache.thrift.protocol.TStruct("ABSLA");

  private static final org.apache.thrift.protocol.TField ACTIVE_TIME_FIELD_DESC = new org.apache.thrift.protocol.TField("activeTime", org.apache.thrift.protocol.TType.I32, (short)1);
  private static final org.apache.thrift.protocol.TField EXPIRATION_TIME_FIELD_DESC = new org.apache.thrift.protocol.TField("expirationTime", org.apache.thrift.protocol.TType.STRING, (short)2);
  private static final org.apache.thrift.protocol.TField NUM_REQUESTS_FIELD_DESC = new org.apache.thrift.protocol.TField("numRequests", org.apache.thrift.protocol.TType.I32, (short)3);

  private static final Map<Class<? extends IScheme>, SchemeFactory> schemes = new HashMap<Class<? extends IScheme>, SchemeFactory>();
  static {
    schemes.put(StandardScheme.class, new ABSLAStandardSchemeFactory());
    schemes.put(TupleScheme.class, new ABSLATupleSchemeFactory());
  }

  public int activeTime; // required
  public String expirationTime; // required
  public int numRequests; // required

  /** The set of fields this struct contains, along with convenience methods for finding and manipulating them. */
  public enum _Fields implements org.apache.thrift.TFieldIdEnum {
    ACTIVE_TIME((short)1, "activeTime"),
    EXPIRATION_TIME((short)2, "expirationTime"),
    NUM_REQUESTS((short)3, "numRequests");

    private static final Map<String, _Fields> byName = new HashMap<String, _Fields>();

    static {
      for (_Fields field : EnumSet.allOf(_Fields.class)) {
        byName.put(field.getFieldName(), field);
      }
    }

    /**
     * Find the _Fields constant that matches fieldId, or null if its not found.
     */
    public static _Fields findByThriftId(int fieldId) {
      switch(fieldId) {
        case 1: // ACTIVE_TIME
          return ACTIVE_TIME;
        case 2: // EXPIRATION_TIME
          return EXPIRATION_TIME;
        case 3: // NUM_REQUESTS
          return NUM_REQUESTS;
        default:
          return null;
      }
    }

    /**
     * Find the _Fields constant that matches fieldId, throwing an exception
     * if it is not found.
     */
    public static _Fields findByThriftIdOrThrow(int fieldId) {
      _Fields fields = findByThriftId(fieldId);
      if (fields == null) throw new IllegalArgumentException("Field " + fieldId + " doesn't exist!");
      return fields;
    }

    /**
     * Find the _Fields constant that matches name, or null if its not found.
     */
    public static _Fields findByName(String name) {
      return byName.get(name);
    }

    private final short _thriftId;
    private final String _fieldName;

    _Fields(short thriftId, String fieldName) {
      _thriftId = thriftId;
      _fieldName = fieldName;
    }

    public short getThriftFieldId() {
      return _thriftId;
    }

    public String getFieldName() {
      return _fieldName;
    }
  }

  // isset id assignments
  private static final int __ACTIVETIME_ISSET_ID = 0;
  private static final int __NUMREQUESTS_ISSET_ID = 1;
  private byte __isset_bitfield = 0;
  public static final Map<_Fields, org.apache.thrift.meta_data.FieldMetaData> metaDataMap;
  static {
    Map<_Fields, org.apache.thrift.meta_data.FieldMetaData> tmpMap = new EnumMap<_Fields, org.apache.thrift.meta_data.FieldMetaData>(_Fields.class);
    tmpMap.put(_Fields.ACTIVE_TIME, new org.apache.thrift.meta_data.FieldMetaData("activeTime", org.apache.thrift.TFieldRequirementType.DEFAULT, 
        new org.apache.thrift.meta_data.FieldValueMetaData(org.apache.thrift.protocol.TType.I32        , "int")));
    tmpMap.put(_Fields.EXPIRATION_TIME, new org.apache.thrift.meta_data.FieldMetaData("expirationTime", org.apache.thrift.TFieldRequirementType.DEFAULT, 
        new org.apache.thrift.meta_data.FieldValueMetaData(org.apache.thrift.protocol.TType.STRING)));
    tmpMap.put(_Fields.NUM_REQUESTS, new org.apache.thrift.meta_data.FieldMetaData("numRequests", org.apache.thrift.TFieldRequirementType.DEFAULT, 
        new org.apache.thrift.meta_data.FieldValueMetaData(org.apache.thrift.protocol.TType.I32        , "int")));
    metaDataMap = Collections.unmodifiableMap(tmpMap);
    org.apache.thrift.meta_data.FieldMetaData.addStructMetaDataMap(ABSLA.class, metaDataMap);
  }

  public ABSLA() {
  }

  public ABSLA(
    int activeTime,
    String expirationTime,
    int numRequests)
  {
    this();
    this.activeTime = activeTime;
    setActiveTimeIsSet(true);
    this.expirationTime = expirationTime;
    this.numRequests = numRequests;
    setNumRequestsIsSet(true);
  }

  /**
   * Performs a deep copy on <i>other</i>.
   */
  public ABSLA(ABSLA other) {
    __isset_bitfield = other.__isset_bitfield;
    this.activeTime = other.activeTime;
    if (other.isSetExpirationTime()) {
      this.expirationTime = other.expirationTime;
    }
    this.numRequests = other.numRequests;
  }

  public ABSLA deepCopy() {
    return new ABSLA(this);
  }

  @Override
  public void clear() {
    setActiveTimeIsSet(false);
    this.activeTime = 0;
    this.expirationTime = null;
    setNumRequestsIsSet(false);
    this.numRequests = 0;
  }

  public int getActiveTime() {
    return this.activeTime;
  }

  public ABSLA setActiveTime(int activeTime) {
    this.activeTime = activeTime;
    setActiveTimeIsSet(true);
    return this;
  }

  public void unsetActiveTime() {
    __isset_bitfield = EncodingUtils.clearBit(__isset_bitfield, __ACTIVETIME_ISSET_ID);
  }

  /** Returns true if field activeTime is set (has been assigned a value) and false otherwise */
  public boolean isSetActiveTime() {
    return EncodingUtils.testBit(__isset_bitfield, __ACTIVETIME_ISSET_ID);
  }

  public void setActiveTimeIsSet(boolean value) {
    __isset_bitfield = EncodingUtils.setBit(__isset_bitfield, __ACTIVETIME_ISSET_ID, value);
  }

  public String getExpirationTime() {
    return this.expirationTime;
  }

  public ABSLA setExpirationTime(String expirationTime) {
    this.expirationTime = expirationTime;
    return this;
  }

  public void unsetExpirationTime() {
    this.expirationTime = null;
  }

  /** Returns true if field expirationTime is set (has been assigned a value) and false otherwise */
  public boolean isSetExpirationTime() {
    return this.expirationTime != null;
  }

  public void setExpirationTimeIsSet(boolean value) {
    if (!value) {
      this.expirationTime = null;
    }
  }

  public int getNumRequests() {
    return this.numRequests;
  }

  public ABSLA setNumRequests(int numRequests) {
    this.numRequests = numRequests;
    setNumRequestsIsSet(true);
    return this;
  }

  public void unsetNumRequests() {
    __isset_bitfield = EncodingUtils.clearBit(__isset_bitfield, __NUMREQUESTS_ISSET_ID);
  }

  /** Returns true if field numRequests is set (has been assigned a value) and false otherwise */
  public boolean isSetNumRequests() {
    return EncodingUtils.testBit(__isset_bitfield, __NUMREQUESTS_ISSET_ID);
  }

  public void setNumRequestsIsSet(boolean value) {
    __isset_bitfield = EncodingUtils.setBit(__isset_bitfield, __NUMREQUESTS_ISSET_ID, value);
  }

  public void setFieldValue(_Fields field, Object value) {
    switch (field) {
    case ACTIVE_TIME:
      if (value == null) {
        unsetActiveTime();
      } else {
        setActiveTime((Integer)value);
      }
      break;

    case EXPIRATION_TIME:
      if (value == null) {
        unsetExpirationTime();
      } else {
        setExpirationTime((String)value);
      }
      break;

    case NUM_REQUESTS:
      if (value == null) {
        unsetNumRequests();
      } else {
        setNumRequests((Integer)value);
      }
      break;

    }
  }

  public Object getFieldValue(_Fields field) {
    switch (field) {
    case ACTIVE_TIME:
      return Integer.valueOf(getActiveTime());

    case EXPIRATION_TIME:
      return getExpirationTime();

    case NUM_REQUESTS:
      return Integer.valueOf(getNumRequests());

    }
    throw new IllegalStateException();
  }

  /** Returns true if field corresponding to fieldID is set (has been assigned a value) and false otherwise */
  public boolean isSet(_Fields field) {
    if (field == null) {
      throw new IllegalArgumentException();
    }

    switch (field) {
    case ACTIVE_TIME:
      return isSetActiveTime();
    case EXPIRATION_TIME:
      return isSetExpirationTime();
    case NUM_REQUESTS:
      return isSetNumRequests();
    }
    throw new IllegalStateException();
  }

  @Override
  public boolean equals(Object that) {
    if (that == null)
      return false;
    if (that instanceof ABSLA)
      return this.equals((ABSLA)that);
    return false;
  }

  public boolean equals(ABSLA that) {
    if (that == null)
      return false;

    boolean this_present_activeTime = true;
    boolean that_present_activeTime = true;
    if (this_present_activeTime || that_present_activeTime) {
      if (!(this_present_activeTime && that_present_activeTime))
        return false;
      if (this.activeTime != that.activeTime)
        return false;
    }

    boolean this_present_expirationTime = true && this.isSetExpirationTime();
    boolean that_present_expirationTime = true && that.isSetExpirationTime();
    if (this_present_expirationTime || that_present_expirationTime) {
      if (!(this_present_expirationTime && that_present_expirationTime))
        return false;
      if (!this.expirationTime.equals(that.expirationTime))
        return false;
    }

    boolean this_present_numRequests = true;
    boolean that_present_numRequests = true;
    if (this_present_numRequests || that_present_numRequests) {
      if (!(this_present_numRequests && that_present_numRequests))
        return false;
      if (this.numRequests != that.numRequests)
        return false;
    }

    return true;
  }

  @Override
  public int hashCode() {
    return 0;
  }

  @Override
  public int compareTo(ABSLA other) {
    if (!getClass().equals(other.getClass())) {
      return getClass().getName().compareTo(other.getClass().getName());
    }

    int lastComparison = 0;

    lastComparison = Boolean.valueOf(isSetActiveTime()).compareTo(other.isSetActiveTime());
    if (lastComparison != 0) {
      return lastComparison;
    }
    if (isSetActiveTime()) {
      lastComparison = org.apache.thrift.TBaseHelper.compareTo(this.activeTime, other.activeTime);
      if (lastComparison != 0) {
        return lastComparison;
      }
    }
    lastComparison = Boolean.valueOf(isSetExpirationTime()).compareTo(other.isSetExpirationTime());
    if (lastComparison != 0) {
      return lastComparison;
    }
    if (isSetExpirationTime()) {
      lastComparison = org.apache.thrift.TBaseHelper.compareTo(this.expirationTime, other.expirationTime);
      if (lastComparison != 0) {
        return lastComparison;
      }
    }
    lastComparison = Boolean.valueOf(isSetNumRequests()).compareTo(other.isSetNumRequests());
    if (lastComparison != 0) {
      return lastComparison;
    }
    if (isSetNumRequests()) {
      lastComparison = org.apache.thrift.TBaseHelper.compareTo(this.numRequests, other.numRequests);
      if (lastComparison != 0) {
        return lastComparison;
      }
    }
    return 0;
  }

  public _Fields fieldForId(int fieldId) {
    return _Fields.findByThriftId(fieldId);
  }

  public void read(org.apache.thrift.protocol.TProtocol iprot) throws org.apache.thrift.TException {
    schemes.get(iprot.getScheme()).getScheme().read(iprot, this);
  }

  public void write(org.apache.thrift.protocol.TProtocol oprot) throws org.apache.thrift.TException {
    schemes.get(oprot.getScheme()).getScheme().write(oprot, this);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder("ABSLA(");
    boolean first = true;

    sb.append("activeTime:");
    sb.append(this.activeTime);
    first = false;
    if (!first) sb.append(", ");
    sb.append("expirationTime:");
    if (this.expirationTime == null) {
      sb.append("null");
    } else {
      sb.append(this.expirationTime);
    }
    first = false;
    if (!first) sb.append(", ");
    sb.append("numRequests:");
    sb.append(this.numRequests);
    first = false;
    sb.append(")");
    return sb.toString();
  }

  public void validate() throws org.apache.thrift.TException {
    // check for required fields
    // check for sub-struct validity
  }

  private void writeObject(java.io.ObjectOutputStream out) throws java.io.IOException {
    try {
      write(new org.apache.thrift.protocol.TCompactProtocol(new org.apache.thrift.transport.TIOStreamTransport(out)));
    } catch (org.apache.thrift.TException te) {
      throw new java.io.IOException(te);
    }
  }

  private void readObject(java.io.ObjectInputStream in) throws java.io.IOException, ClassNotFoundException {
    try {
      // it doesn't seem like you should have to do this, but java serialization is wacky, and doesn't call the default constructor.
      __isset_bitfield = 0;
      read(new org.apache.thrift.protocol.TCompactProtocol(new org.apache.thrift.transport.TIOStreamTransport(in)));
    } catch (org.apache.thrift.TException te) {
      throw new java.io.IOException(te);
    }
  }

  private static class ABSLAStandardSchemeFactory implements SchemeFactory {
    public ABSLAStandardScheme getScheme() {
      return new ABSLAStandardScheme();
    }
  }

  private static class ABSLAStandardScheme extends StandardScheme<ABSLA> {

    public void read(org.apache.thrift.protocol.TProtocol iprot, ABSLA struct) throws org.apache.thrift.TException {
      org.apache.thrift.protocol.TField schemeField;
      iprot.readStructBegin();
      while (true)
      {
        schemeField = iprot.readFieldBegin();
        if (schemeField.type == org.apache.thrift.protocol.TType.STOP) { 
          break;
        }
        switch (schemeField.id) {
          case 1: // ACTIVE_TIME
            if (schemeField.type == org.apache.thrift.protocol.TType.I32) {
              struct.activeTime = iprot.readI32();
              struct.setActiveTimeIsSet(true);
            } else { 
              org.apache.thrift.protocol.TProtocolUtil.skip(iprot, schemeField.type);
            }
            break;
          case 2: // EXPIRATION_TIME
            if (schemeField.type == org.apache.thrift.protocol.TType.STRING) {
              struct.expirationTime = iprot.readString();
              struct.setExpirationTimeIsSet(true);
            } else { 
              org.apache.thrift.protocol.TProtocolUtil.skip(iprot, schemeField.type);
            }
            break;
          case 3: // NUM_REQUESTS
            if (schemeField.type == org.apache.thrift.protocol.TType.I32) {
              struct.numRequests = iprot.readI32();
              struct.setNumRequestsIsSet(true);
            } else { 
              org.apache.thrift.protocol.TProtocolUtil.skip(iprot, schemeField.type);
            }
            break;
          default:
            org.apache.thrift.protocol.TProtocolUtil.skip(iprot, schemeField.type);
        }
        iprot.readFieldEnd();
      }
      iprot.readStructEnd();

      // check for required fields of primitive type, which can't be checked in the validate method
      struct.validate();
    }

    public void write(org.apache.thrift.protocol.TProtocol oprot, ABSLA struct) throws org.apache.thrift.TException {
      struct.validate();

      oprot.writeStructBegin(STRUCT_DESC);
      oprot.writeFieldBegin(ACTIVE_TIME_FIELD_DESC);
      oprot.writeI32(struct.activeTime);
      oprot.writeFieldEnd();
      if (struct.expirationTime != null) {
        oprot.writeFieldBegin(EXPIRATION_TIME_FIELD_DESC);
        oprot.writeString(struct.expirationTime);
        oprot.writeFieldEnd();
      }
      oprot.writeFieldBegin(NUM_REQUESTS_FIELD_DESC);
      oprot.writeI32(struct.numRequests);
      oprot.writeFieldEnd();
      oprot.writeFieldStop();
      oprot.writeStructEnd();
    }

  }

  private static class ABSLATupleSchemeFactory implements SchemeFactory {
    public ABSLATupleScheme getScheme() {
      return new ABSLATupleScheme();
    }
  }

  private static class ABSLATupleScheme extends TupleScheme<ABSLA> {

    @Override
    public void write(org.apache.thrift.protocol.TProtocol prot, ABSLA struct) throws org.apache.thrift.TException {
      TTupleProtocol oprot = (TTupleProtocol) prot;
      BitSet optionals = new BitSet();
      if (struct.isSetActiveTime()) {
        optionals.set(0);
      }
      if (struct.isSetExpirationTime()) {
        optionals.set(1);
      }
      if (struct.isSetNumRequests()) {
        optionals.set(2);
      }
      oprot.writeBitSet(optionals, 3);
      if (struct.isSetActiveTime()) {
        oprot.writeI32(struct.activeTime);
      }
      if (struct.isSetExpirationTime()) {
        oprot.writeString(struct.expirationTime);
      }
      if (struct.isSetNumRequests()) {
        oprot.writeI32(struct.numRequests);
      }
    }

    @Override
    public void read(org.apache.thrift.protocol.TProtocol prot, ABSLA struct) throws org.apache.thrift.TException {
      TTupleProtocol iprot = (TTupleProtocol) prot;
      BitSet incoming = iprot.readBitSet(3);
      if (incoming.get(0)) {
        struct.activeTime = iprot.readI32();
        struct.setActiveTimeIsSet(true);
      }
      if (incoming.get(1)) {
        struct.expirationTime = iprot.readString();
        struct.setExpirationTimeIsSet(true);
      }
      if (incoming.get(2)) {
        struct.numRequests = iprot.readI32();
        struct.setNumRequestsIsSet(true);
      }
    }
  }

}

