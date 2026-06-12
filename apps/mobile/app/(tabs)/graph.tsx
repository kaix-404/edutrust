import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, {
  Circle,
  Line,
  Rect,
  G,
  Text as SvgText,
} from 'react-native-svg';

import api from '../../services/api';

export default function GraphScreen() {
  const [userName, setUserName] =
    useState('');
  const [candidateName, setCandidateName] =
    useState('');

  const [skills, setSkills] =
    useState<string[]>([]);

  const loadGraph = async () => {
    try {
      const response =
        await api.get(
          `/graph/${encodeURIComponent(
            userName
          )}`
        );
      
      setCandidateName(userName);

      setSkills(
        response.data.skills || []
      );

    } catch (error) {
      console.log(error);
    }
  };

  const screenWidth =
  Dimensions.get('window').width;

  const svgWidth = Math.max(
    skills.length * 160,
    screenWidth - 80,
    500
  );

  const centerX = svgWidth / 2;
  const centerY = 60;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F5F7FB',
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          Graph Explorer
        </Text>

        <TextInput
          placeholder="User Name"
          value={userName}
          onChangeText={setUserName}
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={loadGraph}
          style={{
            backgroundColor: '#111827',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
            }}
          >
            Load Graph
          </Text>
        </TouchableOpacity>

        {skills.length > 0 && (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,

            }}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Svg
                width={svgWidth}
                height={420}
              >
                {/* User Node */}

                <Circle
                  cx={centerX}
                  cy={centerY}
                  r={35}
                  fill="#111827"
                />

                <SvgText
                  x={centerX}
                  y={centerY + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="15"
                  fontWeight="bold"
                >
                  {candidateName}
                </SvgText>

                {skills.map((skill, index) => {
                  const spacing =
                    svgWidth / (skills.length + 1);

                  const x =
                    spacing * (index + 1);

                  const y = 260;

                  const width = Math.max(
                    skill.length * 9,
                    100
                  );

                  return (
                    <G key={skill}>
                      <Line
                        x1={centerX}
                        y1={centerY + 35}
                        x2={x}
                        y2={y - 25}
                        stroke="#6B7280"
                        strokeWidth="2"
                      />

                      <Rect
                        x={x - width / 2}
                        y={y - 20}
                        width={width}
                        height={40}
                        rx={12}
                        fill="#111827"
                      />

                      <SvgText
                        x={x}
                        y={y + 5}
                        textAnchor="middle"
                        fill="white"
                        fontSize="13"
                      >
                        {skill}
                      </SvgText>
                    </G>
                  );
                })}
              </Svg>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}