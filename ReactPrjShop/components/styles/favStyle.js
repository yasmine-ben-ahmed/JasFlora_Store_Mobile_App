// styles.js

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce4f1', // Soft pink
  },
  header: {
    padding: 20,
    backgroundColor: '#f8bbd0', // Soft pink
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  aboutUsSection: {
    padding: 20,
    backgroundColor: '#fce4f1', // Light pink
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 20,
  },
  aboutUsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d81b60', // Strong pink
  },
  aboutUsText: {
    fontSize: 16,
    color: '#444',
    marginTop: 10,
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A6A6A6', // Neutral gray
  },
  categoryCard: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#6D6D6D',
  },
  cardContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: 150,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
    padding: 15,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginVertical: 10,
  },
  cardImage: {
    height: 120,
    backgroundColor: '#ddd',
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
  },
  viewMoreButton: {
    backgroundColor: '#f06292', // Medium pink
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  testimonialCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  testimonialText: {
    fontSize: 16,
    color: '#444',
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    textAlign: 'right',
  },
  contactSection: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8bbd0', // Soft pink
    borderRadius: 15,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  contactButton: {
    backgroundColor: '#f06292', // Medium pink
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
